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
          "bg-[#0a0a0a] text-white hover:bg-[#262626] hover:text-white",
        tone === "light" &&
          "border-[color:var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
