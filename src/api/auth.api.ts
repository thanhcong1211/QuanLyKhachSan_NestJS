import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { LoginRequest, RegisterRequest } from "@/types/auth.type";

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post(endpoints.auth.login, data),

  register: (data: RegisterRequest) => axiosClient.post(endpoints.auth.register, data),
};
