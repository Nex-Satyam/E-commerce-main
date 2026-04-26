import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, current, and adjacent
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`dots-${index}`} className="flex items-center justify-center px-3 py-2 text-slate-500">
            <MoreHorizontal className="size-4" />
          </span>
        );
      }

      const isCurrentPage = page === currentPage;
      
      return (
        <button
          key={`page-${page}`}
          onClick={() => onPageChange(page as number)}
          className={`flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors
            ${isCurrentPage 
              ? "bg-slate-900 text-white" 
              : "text-slate-600 hover:bg-slate-100"
            }`}
          aria-current={isCurrentPage ? "page" : undefined}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <nav className="flex items-center justify-center gap-1 sm:justify-between" aria-label="Pagination">
      <div className="hidden text-sm text-slate-500 sm:block">
        Page <span className="font-medium text-slate-900">{currentPage}</span> of{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        
        <div className="flex items-center gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
