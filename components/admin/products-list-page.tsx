  "use client";

  import Image from "next/image";
  import Link from "next/link";
  import { useEffect, useMemo, useState } from "react";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { Copy, Edit, PackagePlus, Box } from "lucide-react";
  import toast from "react-hot-toast";
  import type { AdminCategory, AdminProduct, ProductListResponse } from "@/components/admin/types";
  import { productPriceRange, productStockTotal } from "@/components/admin/types";
  import { SkeletonTable } from "./ui/skeleton-table";
  import { EmptyState } from "./ui/empty-state";
  import { Pagination } from "./ui/pagination";
  import { queryKeys } from "@/lib/query-keys";

  const pageSize = 20;

  export function ProductsListPage() {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [active, setActive] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        setPage(1);
        setSearch(searchInput);
      }, 300);
      return () => window.clearTimeout(timer);
    }, [searchInput]);

    const productsQueryParams = {
      search,
      category,
      active,
      page,
      limit: pageSize,
    };

    const productsQuery = useQuery({
      queryKey: queryKeys.admin.products(productsQueryParams),
      queryFn: async () => {
        const params = new URLSearchParams({
          search,
          category,
          active,
          page: String(page),
          limit: String(pageSize),
        });
        const response = await fetch(`/api/admin/products?${params.toString()}`);
        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Failed to load products" }));
          throw new Error(err.error || "Failed to load products");
        }
        const data = (await response.json()) as ProductListResponse;
        return data;
      },
      placeholderData: (previousData) => previousData,
    });

    const products = productsQuery.data?.products ?? [];
    const categories = productsQuery.data?.categories ?? [];
    const total = productsQuery.data?.total ?? 0;
    const loading = productsQuery.isLoading || productsQuery.isFetching;

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

    const toggleActiveMutation = useMutation({
      mutationFn: async ({
        product,
        isActive,
      }: {
        product: AdminProduct;
        isActive: boolean;
      }) => {
        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive }),
        });

        if (!response.ok) throw new Error("Unable to update product.");
      },
      onMutate: async ({ product, isActive }) => {
        await queryClient.cancelQueries({
          queryKey: queryKeys.admin.products(productsQueryParams),
        });
        const previousData = queryClient.getQueryData<ProductListResponse>(
          queryKeys.admin.products(productsQueryParams)
        );

        queryClient.setQueryData<ProductListResponse>(
          queryKeys.admin.products(productsQueryParams),
          (current) =>
            current
              ? {
                  ...current,
                  products: current.products.map((item) =>
                    item.id === product.id ? { ...item, isActive } : item
                  ),
                }
              : current
        );

        return { previousData };
      },
      onError: (error, _variables, context) => {
        queryClient.setQueryData(
          queryKeys.admin.products(productsQueryParams),
          context?.previousData
        );
        toast.error(error instanceof Error ? error.message : "Unable to update product.");
      },
      onSettled: () => {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.admin.products(productsQueryParams),
        });
      },
    });

    const duplicateProductMutation = useMutation({
      mutationFn: async (product: AdminProduct) => {
        const response = await fetch(`/api/admin/products/${product.id}/duplicate`, { method: "POST" });

        if (!response.ok) {
          throw new Error("Could not duplicate product.");
        }

        return response.json() as Promise<{ product: AdminProduct }>;
      },
      onSuccess: (data) => {
        queryClient.setQueryData<ProductListResponse>(
          queryKeys.admin.products(productsQueryParams),
          (current) =>
            current
              ? {
                  ...current,
                  products: [data.product, ...current.products].slice(0, pageSize),
                  total: current.total + 1,
                }
              : current
        );
        toast.success("Product duplicated.");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Could not duplicate product.");
      },
    });

    async function toggleActive(product: AdminProduct, isActive: boolean) {
      toggleActiveMutation.mutate({ product, isActive });
    }

    async function duplicateProduct(product: AdminProduct) {
      duplicateProductMutation.mutate(product);
    }

    return (
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Products</h1>
            <p className="mt-1 text-sm text-slate-500">Manage catalog status, inventory, and variants.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#E1DFEA] px-4 text-sm font-medium text-white hover:bg-[#f1f1f1]"
          >
            <PackagePlus className="size-4" />
            Add product
          </Link>
        </div>

        <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_220px_260px]">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search product name"
              className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <select
              value={category}
              onChange={(event) => {
                setPage(1);
                setCategory(event.target.value);
              }}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-3 rounded-md border border-slate-200 bg-slate-50 p-1">
              {[
                { label: "All", value: "" },
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setActive(item.value);
                  }}
                  className={[
                    "h-8 rounded text-sm font-medium transition",
                    active === item.value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-950",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Variants</th>
                  <th className="px-5 py-3">Price range</th>
                  <th className="px-5 py-3">Stock total</th>
                  <th className="px-5 py-3">Active</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
                  return (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="relative size-12 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          {primaryImage ? (
                            <Image src={primaryImage.url} alt="" fill className="object-cover" sizes="48px" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-950">{product.name}</td>
                      <td className="px-5 py-4 text-slate-600">{product.category.name}</td>
                      <td className="px-5 py-4 text-slate-600">{product.variants.length}</td>
                      <td className="px-5 py-4 text-slate-600">{productPriceRange(product)}</td>
                      <td className="px-5 py-4 text-slate-600">{productStockTotal(product)}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={product.isActive}
                          onClick={() => toggleActive(product, !product.isActive)}
                          className={[
                            "relative h-6 w-11 rounded-full transition",
                            product.isActive ? "bg-green-500" : "bg-slate-300",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "absolute top-1 size-4 rounded-full bg-white transition",
                              product.isActive ? "left-6" : "left-1",
                            ].join(" ")}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            aria-label={`Edit ${product.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            <Edit className="size-4" />
                          </Link>
                          <button
                            type="button"
                            aria-label={`Duplicate ${product.name}`}
                            onClick={() => duplicateProduct(product)}
                            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            <Copy className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
            <span>
              Page {page} of {totalPages} · {total} products
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
      </div>
    );
  }
