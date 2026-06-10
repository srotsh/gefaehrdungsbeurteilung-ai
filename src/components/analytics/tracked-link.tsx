/* AUTO-GENERATED via shared-core/scripts/add-tracked-link.py
 *
 * Client-Wrapper around next/link that fires a Plausible custom event
 * before navigating. Use anywhere a regular <Link> would be used and
 * conversion-tracking is desired.
 */
"use client";
import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { track } from "@/components/analytics/plausible";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    event: string;
    eventProps?: Record<string, string | number | boolean>;
    children: ReactNode;
  };

export function TrackedLink({ event, eventProps, onClick, children, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
