import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-[color:var(--ring)] focus-visible:ring-3 focus-visible:ring-[color:oklch(from var(--ring) l c h/0.5)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[color:var(--destructive)] aria-invalid:ring-3 aria-invalid:ring-[color:oklch(from var(--destructive) l c h/0.2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:oklch(from var(--primary) l c h/0.8)] [a]:hover:bg-[color:oklch(from var(--primary) l c h/0.8)]",
        outline:
          "border-[color:var(--border)] bg-[color:var(--background)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)] aria-expanded:bg-[color:var(--muted)] aria-expanded:text-[color:var(--foreground)]",
        secondary:
          "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)] hover:bg-[color:oklch(from var(--secondary) l c h/0.8)] aria-expanded:bg-[color:var(--secondary)] aria-expanded:text-[color:var(--secondary-foreground)]",
        ghost:
          "hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)] aria-expanded:bg-[color:var(--muted)] aria-expanded:text-[color:var(--foreground)]",
        destructive:
          "bg-[color:oklch(from var(--destructive) l c h/0.1)] text-[color:var(--destructive)] hover:bg-[color:oklch(from var(--destructive) l c h/0.2)] focus-visible:border-[color:oklch(from var(--destructive) l c h/0.4)] focus-visible:ring-[color:oklch(from var(--destructive) l c h/0.2)]",
        link: "text-[color:var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
