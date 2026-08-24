import { userApi, SearchUserPagingParams } from "@/api/user.api";

export const userService = {
  getAll: userApi.getAll,
  create: userApi.create,
  delete: userApi.delete,
  getById: userApi.getById,
  update: userApi.update,
  searchPaging: (params?: SearchUserPagingParams) => {
    console.log("[userService] searchPaging called with:", params);
    return userApi.searchPaging(params);
  },
  searchByName: userApi.searchByName,
};
