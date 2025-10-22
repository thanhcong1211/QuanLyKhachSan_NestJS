import { useQuery } from "@tanstack/react-query";
import { roomApi, SearchRoomParams } from "@/api/room.api";

export function useRoomSearch(params: SearchRoomParams) {
  return useQuery({
    queryKey: ["rooms", "search", params],
    queryFn: () => roomApi.search(params),
    enabled: !!params.locationId || !!params.keyword, // Chỉ gọi khi có locationId hoặc keyword
  });
}

export function useRoomByLocation(locationId: number | null) {
  const query = useQuery({
    queryKey: ["rooms", "location", locationId],
    queryFn: async () => {
      console.log("🌐 API Call: getByLocation", locationId);
      if (!locationId) return null;
      
      const response = await roomApi.getByLocation(locationId);
      console.log("✅ API Response:", response);
      return response;
    },
    enabled: !!locationId, // Chỉ gọi khi có locationId
  });

  console.log("🔄 useRoomByLocation query state:", {
    locationId,
    enabled: !!locationId,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    data: query.data,
    error: query.error,
  });

  return query;
}
