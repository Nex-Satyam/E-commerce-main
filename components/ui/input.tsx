import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-[color:var(--input)] bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus-visible:border-[color:var(--ring)] focus-visible:ring-3 focus-visible:ring-[color:oklch(from var(--ring) l c h/0.5)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[color:oklch(from var(--input) l c h/0.5)] disabled:opacity-50 aria-invalid:border-[color:var(--destructive)] aria-invalid:ring-3 aria-invalid:ring-[color:oklch(from var(--destructive) l c h/0.2)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
