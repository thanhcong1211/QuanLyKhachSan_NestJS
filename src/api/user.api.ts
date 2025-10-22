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
  delete: (id: number) => axiosClient.delete(endpoints.user.delete(id)),
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
