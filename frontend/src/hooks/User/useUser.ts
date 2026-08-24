import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { UpdateUserRequest } from "@/types/user.type";

export const useUser = () => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  const updateUser = useMutation({
    mutationFn: (data: { id: number } & UpdateUserRequest) => userService.update(data.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return { users, updateUser };
};
