import { authMiddleware } from "@flow/auth/middleware";

export default authMiddleware({ productSlug: "vorstandsprotokoll" });

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)"],
};
