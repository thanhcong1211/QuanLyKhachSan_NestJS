import { userApi } from "@/api/user.api";

export const userService = {
  getAll: userApi.getAll,
  create: userApi.create,
  delete: userApi.delete,
  getById: userApi.getById,
  update: userApi.update,
  searchPaging: userApi.searchPaging,
  searchByName: userApi.searchByName,
};
