"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, PackagePlus, ShoppingBag, Users, Warehouse } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/products/new", label: "New Product", icon: PackagePlus },
  { href: "/admin/products/stock", label: "Stock", icon: Warehouse },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f5] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-[#f3f4f5] lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/admin/dashboard" className="text-lg font-semibold">
            NexGem Admin
          </Link>
        </div>
        <nav className="grid gap-1 p-3  ">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href === "/admin/products" && pathname.startsWith("/admin/products/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive ? " text-white" : "text-slate-600 hover:bg-slate-100 ",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Admin Console</p>
            <p className="text-sm text-slate-500">Orders, products, and inventory</p>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600"
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
