import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white p-8 text-center animate-in fade-in duration-500">
      <div className="flex size-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
        {icon || <FolderOpen className="size-10" />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>
      
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
