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
          "bg-[var(--text)] text-[#fff9f2] hover:bg-[color:rgba(47,36,26,0.92)]",
        tone === "light" &&
          "border-[color:var(--border)] bg-[rgba(255,250,242,0.78)] text-[var(--text)] hover:bg-[rgba(255,250,242,0.94)]",
        className,
      )}
      {...props}
    />
  );
}