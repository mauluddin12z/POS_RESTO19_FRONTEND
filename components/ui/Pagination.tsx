import React from "react";
import { PaginationPropsInterface } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

const DOTS = "...";

/**
 * Builds a compact pagination range like:
 * [1, '...', 4, 5, 6, '...', 20]
 *
 * @param totalPages   total number of pages
 * @param currentPage  current active page
 * @param siblingCount how many page numbers to show on each side of currentPage
 */
function getPaginationRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
) {
  // total buttons = firstPage + lastPage + currentPage + 2*siblings + 2*dots
  const totalPageNumbers = siblingCount * 2 + 5;

  // If total pages is small enough, just show all of them, no dots needed
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  // Only show left dots if there's a gap of more than 1 page between
  // the first page and the leftSiblingIndex
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // Case 1: No left dots, but right dots needed
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, DOTS, lastPageIndex];
  }

  // Case 2: No right dots, but left dots needed
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  // Case 3: Both left and right dots needed
  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  // Fallback (shouldn't hit, but keeps TS/edge-cases happy)
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

interface PaginationProps extends PaginationPropsInterface {
  /**
   * How many page numbers to show on each side of the current page.
   * Total visible numbers = siblingCount * 2 + 5 (first, last, current, siblings).
   * Defaults to 1 (e.g. 1 ... 4 5 6 ... 20).
   */
  siblingCount?: number;
}

export default function Pagination({
  totalPages,
  currentPage,
  hasNextPage,
  isLoading,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    if (isLoading || page === currentPage) return;
    onPageChange(page);
  };

  if (isLoading) {
    return (
      <ul className="inline-flex -space-x-px">
        {/* Prev Page */}
        <li>
          <button
            className="w-10 h-10 leading-tight bg-white border border-gray-300 rounded-l-lg text-gray-400"
            disabled
          >
            <ArrowLeft />
          </button>
        </li>

        {/* Page Numbers */}
        <li>
          <button
            className="w-10 h-10 leading-tight text-gray-400 bg-white border border-gray-300"
            disabled
          >
            1
          </button>
        </li>

        {/* Next Page */}
        <li>
          <button
            className="w-10 h-10 leading-tight bg-white border border-gray-300 rounded-r-lg text-gray-400"
            disabled
          >
            <ArrowRight />
          </button>
        </li>
      </ul>
    );
  }

  const paginationRange = getPaginationRange(
    totalPages,
    currentPage,
    siblingCount,
  );

  return (
    <div className="flex justify-center items-center gap-x-2">
      <ul className="inline-flex -space-x-px">
        {/* Prev Page */}
        <li>
          <button
            aria-label="previousPage"
            disabled={currentPage <= 1}
            className={`w-10 h-10 flex justify-center items-center leading-tight bg-white border border-gray-300 rounded-l-lg ${
              currentPage <= 1
                ? "text-gray-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer disabled:cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ArrowLeft />
          </button>
        </li>

        {/* Page Numbers */}
        {paginationRange.map((page, index) => {
          if (page === DOTS) {
            return (
              <li key={`dots-${index}`}>
                <span className="w-10 h-10 flex justify-center items-center leading-tight bg-white border border-gray-300 text-gray-400 select-none">
                  &#8230;
                </span>
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                className={`${
                  currentPage === page
                    ? "text-white border border-gray-300 bg-blue-500"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } w-10 h-10 flex justify-center items-center leading-tight cursor-pointer`}
                onClick={() => handlePageChange(page as number)}
                disabled={isLoading}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Next Page */}
        <li>
          <button
            aria-label="nextPage"
            disabled={!hasNextPage}
            className={`w-10 h-10 flex justify-center items-center leading-tight bg-white border border-gray-300 rounded-r-lg ${
              !hasNextPage
                ? "text-gray-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer disabled:cursor-not-allowed "
            } `}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ArrowRight />
          </button>
        </li>
      </ul>
    </div>
  );
}
