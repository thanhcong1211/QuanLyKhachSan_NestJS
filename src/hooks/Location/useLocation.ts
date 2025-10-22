import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";

export const useLocation = () => {
  const queryClient = useQueryClient();

  const locations = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const createLocation = useMutation({
    mutationFn: locationService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  return { locations, createLocation };
};
