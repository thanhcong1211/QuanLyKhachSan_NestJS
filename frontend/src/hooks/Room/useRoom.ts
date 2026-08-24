import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/services/roomService";
import type { Room } from "@/types/room.type";

export const useRoom = (id?: number) => {
  const { data, isLoading, error } = useQuery<{ content?: Room } | undefined>({
    queryKey: ["room", id],
    queryFn: async () => {
      const res = await roomService.getById(id!);
      // axiosClient interceptor returns response.data — ensure we return the expected shape
      return (res as { content?: Room }) || undefined;
    },
    enabled: !!id,
  });

  return {
    // axiosClient already unwraps response.data, backend response shape: { statusCode, content }
    room: data?.content || null,
    isLoading,
    error,
  };
};
