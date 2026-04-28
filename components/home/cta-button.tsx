import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonProps = React.ComponentProps<typeof Button> & {
  tone?: "dark" | "light";
};

export function CtaButton({
  className,
  tone = "dark",
  ...props
}: CtaButtonProps) {
  return (
    <Button
      className={cn(
        "rounded-full px-5 py-5 text-sm font-semibold shadow-none transition-transform hover:-translate-y-0.5",
        tone === "dark" &&
          "bg-[var(--text)] text-[var(--primary-foreground)] hover:bg-[color:var(--ink-soft)]",
        tone === "light" &&
          "border-[color:var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
