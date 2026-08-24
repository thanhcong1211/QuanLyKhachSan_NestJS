import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  infoLabel?: string; // Template: "Trang {page} / {total} ({count} mục)"
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  previousLabel = "Trước",
  nextLabel = "Tiếp",
  infoLabel = "Trang {page} / {total} ({count} mục)",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const displayInfo = infoLabel
    .replace("{page}", String(currentPage))
    .replace("{total}", String(totalPages))
    .replace("{count}", String(totalItems));

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-900/50">
      {/* Info */}
      <div className="text-sm text-gray-400">{displayInfo}</div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {previousLabel}
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Smart pagination: hiển thị trang đầu, cuối, và gần current
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1);

            const showLeftEllipsis = page === currentPage - 2 && currentPage > 3;
            const showRightEllipsis =
              page === currentPage + 2 && currentPage < totalPages - 2;

            if (showLeftEllipsis || showRightEllipsis) {
              return (
                <span key={page} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            if (!showPage) return null;

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
                className={`h-9 w-9 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
