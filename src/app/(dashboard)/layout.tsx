import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { tryGetAccount } from "@/lib/server-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await tryGetAccount();
  if (!auth) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
