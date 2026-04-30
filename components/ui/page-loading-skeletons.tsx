import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <div className="border-b border-[color:var(--border)] bg-white/90 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-full bg-neutral-200" />
          <div className="grid gap-2">
            <Skeleton className="h-4 w-36 bg-neutral-200" />
            <Skeleton className="h-3 w-24 bg-neutral-200" />
          </div>
        </div>
        <div className="hidden flex-1 justify-center gap-3 md:flex">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-28 rounded-full bg-neutral-200" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-10 rounded-full bg-neutral-200" />
          <Skeleton className="size-10 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border border-neutral-200 bg-white p-4">
          <Skeleton className="aspect-[4/5] w-full rounded-lg bg-neutral-200" />
          <div className="mt-4 grid gap-3">
            <Skeleton className="h-4 w-3/4 bg-neutral-200" />
            <Skeleton className="h-3 w-full bg-neutral-200" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 bg-neutral-200" />
              <Skeleton className="h-9 w-20 rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SitePageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black" aria-busy="true">
      <HeaderSkeleton />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-center gap-4">
            <Skeleton className="h-4 w-28 rounded-full bg-neutral-200" />
            <Skeleton className="h-14 w-full max-w-lg bg-neutral-200" />
            <Skeleton className="h-14 w-4/5 max-w-md bg-neutral-200" />
            <Skeleton className="h-5 w-full max-w-xl bg-neutral-200" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36 rounded-full bg-neutral-200" />
              <Skeleton className="h-11 w-32 rounded-full bg-neutral-200" />
            </div>
          </div>
          <Skeleton className="min-h-80 rounded-lg bg-neutral-200" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg bg-neutral-200" />
          ))}
        </div>
        <ProductGridSkeleton />
      </section>
    </main>
  );
}

export function ProductPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black" aria-busy="true">
      <HeaderSkeleton />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4">
          <Skeleton className="aspect-[4/5] rounded-lg bg-neutral-200 md:aspect-square" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-lg bg-neutral-200" />
            ))}
          </div>
        </div>
        <div className="grid h-fit gap-5 rounded-lg border border-neutral-200 bg-white p-6">
          <Skeleton className="h-8 w-32 rounded-full bg-neutral-200" />
          <Skeleton className="h-16 w-full bg-neutral-200" />
          <Skeleton className="h-8 w-48 bg-neutral-200" />
          <Skeleton className="h-36 rounded-lg bg-neutral-200" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg bg-neutral-200" />
            ))}
          </div>
          <Skeleton className="h-12 rounded-full bg-neutral-200" />
          <Skeleton className="h-12 rounded-full bg-neutral-200" />
        </div>
      </section>
    </main>
  );
}

export function CartPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black" aria-busy="true">
      <HeaderSkeleton />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[1fr_0.46fr]">
        <div className="grid gap-4">
          <Skeleton className="h-36 rounded-lg bg-neutral-200" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 md:grid-cols-[180px_1fr_auto]">
              <Skeleton className="aspect-square rounded-lg bg-neutral-200" />
              <div className="grid content-center gap-3">
                <Skeleton className="h-6 w-52 bg-neutral-200" />
                <Skeleton className="h-4 w-full max-w-md bg-neutral-200" />
                <Skeleton className="h-9 w-72 rounded-full bg-neutral-200" />
              </div>
              <Skeleton className="h-24 w-36 rounded-lg bg-neutral-200" />
            </div>
          ))}
        </div>
        <div className="h-fit rounded-lg border border-neutral-200 bg-white p-5">
          <Skeleton className="h-28 rounded-lg bg-neutral-200" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full bg-neutral-200" />
            ))}
            <Skeleton className="h-14 rounded-lg bg-neutral-200" />
            <Skeleton className="h-12 rounded-full bg-neutral-200" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black" aria-busy="true">
      <HeaderSkeleton />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8 lg:grid-cols-[1fr_0.48fr]">
        <div className="grid gap-5">
          <Skeleton className="h-32 rounded-lg bg-neutral-200" />
          <Skeleton className="h-72 rounded-lg bg-neutral-200" />
          <Skeleton className="h-56 rounded-lg bg-neutral-200" />
        </div>
        <div className="h-fit rounded-lg border border-neutral-200 bg-white p-5">
          <Skeleton className="h-28 rounded-lg bg-neutral-200" />
          <div className="mt-5 grid gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full bg-neutral-200" />
            ))}
            <Skeleton className="h-14 rounded-lg bg-neutral-200" />
            <Skeleton className="h-12 rounded-lg bg-neutral-200" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function OrdersPageSkeleton() {
  return (
    <main className="min-h-screen bg-white text-black" aria-busy="true">
      <HeaderSkeleton />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-8">
        <Skeleton className="h-40 rounded-lg bg-neutral-200" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg bg-neutral-200" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-lg bg-neutral-200" />
        ))}
      </section>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main className="grid min-h-screen place-items-center bg-white p-6" aria-busy="true">
      <div className="grid w-full max-w-md gap-5 rounded-lg border border-neutral-200 bg-white p-6">
        <Skeleton className="mx-auto size-16 rounded-full bg-neutral-200" />
        <Skeleton className="mx-auto h-8 w-48 bg-neutral-200" />
        <Skeleton className="h-12 rounded-lg bg-neutral-200" />
        <Skeleton className="h-12 rounded-lg bg-neutral-200" />
        <Skeleton className="h-12 rounded-full bg-neutral-200" />
      </div>
    </main>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-8 w-44 bg-slate-200" />
          <Skeleton className="h-4 w-72 bg-slate-200" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-md bg-slate-200" />
        ))}
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <Skeleton className="h-10 w-full bg-slate-200" />
        <div className="mt-5 grid gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
