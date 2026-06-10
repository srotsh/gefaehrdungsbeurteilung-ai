import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export interface AuthMiddlewareOptions {
  /**
   * Slug des Produkts (z. B. "protokollflow"). Wird im Log als Quelle
   * markiert und kann später für produkt-spezifisches Routing genutzt werden.
   */
  productSlug: string;
  /**
   * Pfade, die auf eingeloggte User beschränkt sind. Match per
   * exact-or-prefix-with-slash (boundary-safe).
   */
  protectedPrefixes?: string[];
  /**
   * Auth-Routes — eingeloggte User werden weggeleitet.
   */
  authRoutes?: string[];
  /**
   * Wohin werden Eingeloggte von /login bzw. /signup weitergeleitet.
   */
  defaultRedirectAfterLogin?: string;
  /**
   * Wohin werden Nicht-Eingeloggte von geschützten Routen weitergeleitet.
   */
  loginPath?: string;
  /**
   * Optional: zusätzliche Security-Header. Defaults sind konservativ.
   */
  extraSecurityHeaders?: Record<string, string>;
}

const DEFAULT_PROTECTED = [
  "/dashboard",
  "/upload",
  "/protokoll",
  "/wegs",
  "/settings",
  "/onboarding",
];

const DEFAULT_AUTH_ROUTES = ["/login", "/signup"];

function defaultSecurityHeaders(): HeadersInit {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), usb=(), payment=(self)",
  };
}

/**
 * Whitelist-basierter Open-Redirect-Schutz.
 */
function safeRedirectPath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length > 1024) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.startsWith("/\\")) return null;
  if (/^[a-z]+:/i.test(value.slice(1))) return null;
  return value;
}

/**
 * Factory für eine Auth-Middleware. Jede App ruft das einmalig in ihrer
 * `middleware.ts` auf:
 *
 * ```ts
 * import { authMiddleware } from "@flow/auth/middleware";
 * export default authMiddleware({ productSlug: "protokollflow" });
 * export const config = { matcher: [...] };
 * ```
 */
export function authMiddleware(opts: AuthMiddlewareOptions) {
  const protectedPrefixes = opts.protectedPrefixes ?? DEFAULT_PROTECTED;
  const authRoutes = opts.authRoutes ?? DEFAULT_AUTH_ROUTES;
  const loginPath = opts.loginPath ?? "/login";
  const defaultRedirect = opts.defaultRedirectAfterLogin ?? "/dashboard";

  const securityHeaders = (): HeadersInit => ({
    ...defaultSecurityHeaders(),
    ...(opts.extraSecurityHeaders ?? {}),
  });

  const withHeaders = (response: NextResponse): NextResponse => {
    const headers = securityHeaders();
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v as string);
    }
    return response;
  };

  return async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return new NextResponse("Auth backend not configured.", {
        status: 503,
        headers: securityHeaders(),
      });
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    let userId: string | null = null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) userId = data.user.id;
    } catch (err) {
      console.warn(
        `[@flow/auth][${opts.productSlug}] auth.getUser failed:`,
        err
      );
    }

    const { pathname } = request.nextUrl;

    const isProtected = protectedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    const isAuthRoute = authRoutes.includes(pathname);

    if (!userId && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = loginPath;
      url.search = "";
      const intended = pathname + (request.nextUrl.search || "");
      const safe = safeRedirectPath(intended);
      if (safe) url.searchParams.set("redirect", safe);
      return withHeaders(NextResponse.redirect(url));
    }

    if (userId && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = defaultRedirect;
      url.search = "";
      return withHeaders(NextResponse.redirect(url));
    }

    return withHeaders(supabaseResponse);
  };
}

/**
 * Default-Matcher für die meisten Apps. Wer abweichende Patterns braucht,
 * exportiert sein eigenes `config.matcher`.
 */
export const defaultMatcher = [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
];
