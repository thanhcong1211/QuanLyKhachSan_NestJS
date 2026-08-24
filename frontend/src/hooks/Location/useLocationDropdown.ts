import { useState, useRef, useEffect } from "react";
import type { Location } from "@/types/location.type";

export function useLocationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchByLocationId, setSearchByLocationId] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterLocations = (
    locationsList: Location[],
    searchQuery: string
  ): Location[] => {
    if (!searchQuery.trim()) {
      // Reset searchByLocationId nếu không có query
      if (searchByLocationId) setSearchByLocationId(false);
      return locationsList;
    }

    const query = searchQuery.toLowerCase().trim();
    const isIdSearch = /^\d+$/.test(query);
    
    // Chỉ update state khi giá trị thực sự thay đổi
    if (isIdSearch !== searchByLocationId) {
      setSearchByLocationId(isIdSearch);
    }

    return locationsList.filter((location) => {
      // Check if searching by ID
      if (isIdSearch) {
        return location.id.toString().includes(query);
      }
      
      return (
        location.tenViTri.toLowerCase().includes(query) ||
        location.tinhThanh.toLowerCase().includes(query) ||
        location.quocGia.toLowerCase().includes(query)
      );
    });
  };

  return {
    showDropdown,
    setShowDropdown,
    searchByLocationId,
    dropdownRef,
    filterLocations,
  };
}
