import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string; //  "users", "providers", "jobs" polle
}

export default function Pagination({ page, limit, total, onPageChange, label = "results" }: PaginationProps) {
  if (total <= limit) return null;

  const totalPages = Math.ceil(total / limit);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
      <span className="text-sm text-gray-600 font-medium">
        Showing {from} to {to} of {total} {label}
      </span>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed border border-gray-200 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed border border-gray-200 transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
