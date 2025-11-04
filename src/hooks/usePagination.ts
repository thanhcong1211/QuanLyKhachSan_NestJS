import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
  dependencies?: unknown[];
}

export function usePagination<T>({
  items,
  itemsPerPage = 8,
  dependencies = [],
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset về trang 1 khi items hoặc dependencies thay đổi
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, ...dependencies]);

  // Tính toán pagination
  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    setCurrentPage,
    totalItems: items.length,
    itemsPerPage,
  };
}
