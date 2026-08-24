import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: () => router.push("/"),
  });

  const register = useMutation({
    mutationFn: authService.register,
  });

  return { login, register };
};
