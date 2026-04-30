"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-keys";

type StockRow = {
  variantId: string;
  productName: string;
  variantName: string;
  stock: number;
};

export function BulkStockPage() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, number>>({});

  const rowsQuery = useQuery({
    queryKey: queryKeys.admin.bulkStock,
    queryFn: async () => {
      const response = await fetch("/api/admin/products/bulk-stock");
      const data = await response.json();
      return (data.variants ?? []) as StockRow[];
    },
  });

  const rows = useMemo(() => rowsQuery.data ?? [], [rowsQuery.data]);

  const changedRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          Object.prototype.hasOwnProperty.call(drafts, row.variantId) &&
          Number(drafts[row.variantId]) !== row.stock
      ),
    [drafts, rows]
  );

  const saveStockMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/products/bulk-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: changedRows.map((row) => ({
          variantId: row.variantId,
          stock: Number(drafts[row.variantId]),
        })),
      }),
    });

      if (!response.ok) throw new Error("Unable to update stock.");
    },
    onSuccess: async () => {
      toast.success("Stock updated.");
      setDrafts({});
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.bulkStock });
    },
    onError: () => {
      toast.error("Unable to update stock.");
    },
  });

  async function saveChanges() {
    saveStockMutation.mutate();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Bulk Stock Update</h1>
        <p className="mt-1 text-sm text-slate-500">Edit variant inventory inline and save in one request.</p>
      </div>

      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Product name</th>
                <th className="px-5 py-3">Variant name</th>
                <th className="px-5 py-3">Current stock</th>
                <th className="px-5 py-3">New stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.variantId}>
                  <td className="px-5 py-4 font-medium text-slate-950">{row.productName}</td>
                  <td className="px-5 py-4 text-slate-600">{row.variantName}</td>
                  <td className="px-5 py-4 text-slate-600">{row.stock}</td>
                  <td className="px-5 py-4">
                    <input
                      type="number"
                      min="0"
                      value={drafts[row.variantId] ?? 0}
                      onChange={(event) =>
                        setDrafts((current) => ({ ...current, [row.variantId]: Number(event.target.value) }))
                      }
                      className="h-10 w-32 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <p className="text-sm text-slate-500">{changedRows.length} pending changes</p>
          <button
            type="button"
            disabled={saveStockMutation.isPending || changedRows.length === 0}
            onClick={saveChanges}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" />
            {saveStockMutation.isPending ? "Saving..." : "Save all changes"}
          </button>
        </div>
      </section>
    </div>
  );
}
