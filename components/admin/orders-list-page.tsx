"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { Download, Eye, ShoppingBag } from "lucide-react";
import type { AdminOrder, OrderStatus } from "@/components/admin/types";
import { formatCurrency, formatDateInput, formatShortDate, orderStatusClass } from "@/components/admin/types";
import { SkeletonTable } from "./ui/skeleton-table";
import { EmptyState } from "./ui/empty-state";
import { Pagination } from "./ui/pagination";

const statuses: Array<{ label: string; value: "" | OrderStatus }> = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const pageSize = 20;

export function OrdersListPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const from = formatDateInput(range?.from);
  const to = formatDateInput(range?.to);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const params = new URLSearchParams({
        status,
        search,
        from,
        to,
        page: String(page),
        limit: String(pageSize),
      });
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setLoading(false);
    }

    loadOrders();
  }, [from, page, search, status, to]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  function exportCsv() {
    const params = new URLSearchParams({ status, from, to });
    window.location.href = `/api/admin/orders/export?${params.toString()}`;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Filter, review, export, and update customer orders.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(item.value);
              }}
              className={[
                "h-9 rounded-md px-3 text-sm font-medium transition",
                status === item.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-start">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search order ID or customer email"
            className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCalendarOpen((current) => !current)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {from || to ? `${from || "Start"} to ${to || "End"}` : "Choose date range"}
            </button>
            {isCalendarOpen ? (
              <div className="absolute right-0 z-20 mt-2 rounded-md border border-slate-200 bg-white p-3 shadow-lg">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={(nextRange) => {
                    setPage(1);
                    setRange(nextRange);
                  }}
                  numberOfMonths={2}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRange(undefined);
                      setPage(1);
                    }}
                    className="h-8 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(false)}
                    className="h-8 rounded-md bg-slate-900 px-3 text-sm font-medium text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items count</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono text-slate-700">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-950">{order.customerName}</p>
                    <p className="text-xs text-slate-500">{order.customerEmail ?? "No email"}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${orderStatusClass[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{formatShortDate(order.createdAt)}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                      aria-label={`View order ${order.id}`}
                    >
                      <Eye className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} · {total} orders
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="h-9 rounded-md border border-slate-200 px-3 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="h-9 rounded-md border border-slate-200 px-3 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {loading ? (
        <SkeletonTable columns={7} rows={10} />
      ) : orders.length === 0 ? (
        <EmptyState 
          title="No orders found"
          description={search || status || from || to ? "No orders matched your filters. Try adjusting them." : "You don't have any orders yet."}
          icon={<ShoppingBag className="size-10" />}
        />
      ) : (
        <section className="rounded-md border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items count</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono text-slate-700">{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-950">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.customerEmail ?? "No email"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${orderStatusClass[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{formatShortDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                        aria-label={`View order ${order.id}`}
                      >
                        <Eye className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 px-5 py-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
      )}
    </div>
  );
}
