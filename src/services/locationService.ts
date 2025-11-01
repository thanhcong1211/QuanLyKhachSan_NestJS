import { locationApi, SearchLocationParams } from "@/api/location.api";
import type { Location, CreateLocationRequest, UpdateLocationRequest } from "@/types/location.type";

export const locationService = {
  // Lấy tất cả vị trí
  getAll: async () => {
    return await locationApi.getAll();
  },

  // Phân trang và tìm kiếm
  search: async (params?: SearchLocationParams) => {
    return await locationApi.search(params);
  },

  // Lấy vị trí theo ID
  getById: async (id: number) => {
    return await locationApi.getById(id);
  },

  // Tạo vị trí mới
  create: async (data: CreateLocationRequest) => {
    return await locationApi.create(data);
  },

  // Cập nhật vị trí
  update: async (id: number, data: UpdateLocationRequest) => {
    return await locationApi.update(id, data);
  },

  // Xóa vị trí
  delete: async (id: number) => {
    console.log("[locationService] Deleting location with id:", id);
    try {
      const response = await locationApi.delete(id);
      console.log("[locationService] Delete response:", response);
      return response;
    } catch (error) {
      console.error("[locationService] Delete error details:", error);
      throw error;
    }
  },

  // Upload hình ảnh vị trí
  uploadImage: async (locationId: number, file: File) => {
    const formData = new FormData();
    formData.append("formFile", file);
    formData.append("maViTri", locationId.toString());
    
    return await locationApi.uploadImage(formData);
  },

  // Tạo vị trí với hình ảnh
  createWithImage: async (data: CreateLocationRequest, imageFile?: File) => {
    // Tạo vị trí
    const response = await locationApi.create(data);
    const locationData = response as { content?: Location };
    const createdLocation = locationData.content;

    // Upload hình nếu có
    if (imageFile && createdLocation?.id) {
      await locationService.uploadImage(createdLocation.id, imageFile);
    }

    return response;
  },

  // Cập nhật vị trí với hình ảnh
  updateWithImage: async (id: number, data: UpdateLocationRequest, imageFile?: File) => {
    // Cập nhật vị trí
    try {
      const response = await locationApi.update(id, data);
      console.log("[locationService] Update response:", response);

      // Upload hình mới nếu có
      if (imageFile) {
        const uploadRes = await locationService.uploadImage(id, imageFile);
        console.log("[locationService] Upload image response:", uploadRes);
      }

      return response;
    } catch (error) {
      console.error("[locationService] Update error:", error);
      throw error;
    }
  },
};

