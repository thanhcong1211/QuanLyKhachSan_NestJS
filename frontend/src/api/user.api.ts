import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { UpdateUserRequest, User } from "@/types/user.type";

export interface SearchUserPagingParams {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
}

export const userApi = {
  getAll: () => axiosClient.get(endpoints.user.getAll),
  create: (data: Partial<User>) => axiosClient.post(endpoints.user.create, data),
  delete: (id: number) => {
    console.log("[userApi] Deleting user id:", id);
    console.log("[userApi] DELETE URL:", endpoints.user.delete(id));
    return axiosClient.delete(endpoints.user.delete(id))
      .then((res) => {
        console.log("[userApi] Delete SUCCESS response:", res);
        return res;
      })
      .catch((err) => {
        console.error("[userApi] Delete FULL ERROR object:", err);
        console.error("[userApi] Delete error message:", err?.message);
        console.error("[userApi] Delete error response status:", err?.response?.status);
        console.error("[userApi] Delete error response data:", err?.response?.data);
        
        const errorMessage = err?.response?.data?.message || err?.response?.data?.content || err?.message || "Unknown error";
        const errorStatus = err?.response?.status || "No status";
        throw new Error(`Delete user failed (${errorStatus}): ${errorMessage}`);
      });
  },
  getById: (id: number) => axiosClient.get(endpoints.user.getById(id)),
  update: (id: number, data: UpdateUserRequest) =>
    axiosClient.put(endpoints.user.update(id), data),
  searchPaging: (params?: SearchUserPagingParams) => {
    const searchParams = new URLSearchParams();
    if (params?.keyword) searchParams.append("keyword", params.keyword);
    if (params?.pageIndex) searchParams.append("pageIndex", params.pageIndex.toString());
    if (params?.pageSize) searchParams.append("pageSize", params.pageSize.toString());
    const queryString = searchParams.toString();
    return axiosClient.get(`${endpoints.user.searchPaging}${queryString ? `?${queryString}` : ""}`);
  },
  searchByName: (name: string) => axiosClient.get(endpoints.user.searchByName(name)),
};
