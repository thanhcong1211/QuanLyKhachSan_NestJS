"use client";

import SearchButton from "@/components/ui/SearchButton";

interface SearchBoxProps {
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

/**
 * SearchBox component - Wrapper cho SearchButton dùng trong Navbar
 * 
 * @example
 * ```tsx
 * <SearchBox onClick={handleSearch} loading={isSearching} />
 * ```
 */
export default function SearchBox({
  onClick = () => {},
  loading = false,
  className = "",
}: SearchBoxProps) {
  return (
    <div className={`flex-shrink-0 px-2 ${className}`}>
      <SearchButton
        onClick={onClick}
        loading={loading}
        size="middle"
        shape="circle"
        tooltip="Tìm kiếm"
      />
    </div>
  );
}
    
