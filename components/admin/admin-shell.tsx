"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, LogOut, PackagePlus, ShoppingBag, Tags, Users, Warehouse, Menu } from "lucide-react";
import { NotificationsBell } from "./notifications-bell";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f5] text-slate-950 flex flex-col md:flex-row">
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-200 bg-[#f3f4f5] transition-all duration-300
        ${isMobileOpen ? "w-64" : "w-16 md:w-64"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 md:px-6">
          <Link
            href="/admin/dashboard"
            className={`text-lg font-semibold whitespace-nowrap overflow-hidden transition-all ${isMobileOpen ? "w-auto opacity-100" : "w-0 opacity-0 md:w-auto md:opacity-100"}`}
          >
            Admin Panel
          </Link>
          <button
            className="md:hidden p-1 rounded-md hover:bg-slate-200"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Menu className="size-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href === "/admin/products" && pathname.startsWith("/admin/products/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition whitespace-nowrap overflow-hidden
                  ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200"}
                  ${isMobileOpen ? "gap-3" : "justify-center md:justify-start md:gap-3"}
                `}
                title={!isMobileOpen ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                <span className={`transition-all ${isMobileOpen ? "w-auto opacity-100" : "w-0 opacity-0 md:w-auto md:opacity-100"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 transition-all duration-300 ml-16 md:ml-64">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 hidden sm:block">Admin Console</p>
            <p className="text-lg font-semibold sm:hidden">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsBell />
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="flex items-center gap-3">
              {session?.user && (
                <div className="hidden text-right text-sm sm:block">
                  <p className="font-medium text-slate-900">{session.user.name}</p>
                  <p className="text-xs text-slate-500">{session.user.email}</p>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center justify-center rounded-md bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                title="Logout"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
