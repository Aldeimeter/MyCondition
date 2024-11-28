import React from "react";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
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
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <ChevronsLeft />
      </button>
      <span className="text-sm font-medium text-gray-700">
        {currentPage}/{totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <ChevronsRight />
      </button>
    </div>
  );
};
