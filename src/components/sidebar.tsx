"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Factory,
  FileText,
  Mic,
  Settings,
  ListChecks,
  CreditCard,
} from "lucide-react";

const NAV = [
  { href: "/",                 label: "Übersicht",          icon: LayoutDashboard },
  { href: "/neu",              label: "Neue Beurteilung",   icon: Mic },
  { href: "/gbu",              label: "Beurteilungen",      icon: FileText },
  { href: "/arbeitsbereiche",  label: "Arbeitsbereiche",    icon: Factory },
  { href: "/massnahmen",       label: "Maßnahmen",          icon: ListChecks },
  { href: "/settings/billing", label: "Abrechnung",         icon: CreditCard },
  { href: "/settings",         label: "Einstellungen",      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-bold">GefaehrdungsbeurteilungAI</h1>
        <p className="text-xs text-muted-foreground">§5/§6 ArbSchG — audit-sicher dokumentiert</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
