import { useState } from "react";
import { useRouter } from "next/navigation";

export interface SearchParams {
  searchQuery?: string;
  locationId?: number | null;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}

export function useSearch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    
    try {
      // Không cần gọi API trước, chỉ navigate với params
      // Trang SearchPage sẽ tự gọi API với params này
      const urlParams = new URLSearchParams();
      
      // Ưu tiên locationId nếu có
      if (params.locationId) {
        urlParams.append("locationId", params.locationId.toString());
      } else if (params.searchQuery?.trim()) {
        // Nếu không có locationId thì dùng searchQuery
        urlParams.append("q", params.searchQuery.trim());
      }
      
      if (params.checkInDate) {
        urlParams.append("checkIn", params.checkInDate);
      }
      if (params.checkOutDate) {
        urlParams.append("checkOut", params.checkOutDate);
      }
      if (params.guests && params.guests > 1) {
        urlParams.append("guests", params.guests.toString());
      }

      // Navigate đến trang search
      router.push(`/search?${urlParams.toString()}`);
    } catch (error) {
      console.error("❌ Search navigation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSearch,
    loading,
  };
}
