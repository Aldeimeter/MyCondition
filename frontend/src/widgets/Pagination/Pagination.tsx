import {
  ChevronsRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (currentPage: number) => void;
}
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        disabled={currentPage <= 5}
        onClick={() => onPageChange(currentPage - 5)}
        className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium text-gray-700">
        {currentPage}/{totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        disabled={currentPage >= totalPages - 4}
        onClick={() => onPageChange(currentPage + 5)}
        className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};
