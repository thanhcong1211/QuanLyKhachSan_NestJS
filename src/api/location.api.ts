import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { CreateLocationRequest, UpdateLocationRequest } from "@/types/location.type";

export interface SearchLocationParams {
  keyword?: string;
  pageIndex?: number;
  pageSize?: number;
}

export const locationApi = {
  // GET /api/vi-tri - Lấy tất cả vị trí
  getAll: () => axiosClient.get(endpoints.location.getAll),
  
  // GET /api/vi-tri/phan-trang-tim-kiem - Phân trang tìm kiếm vị trí
  search: (params?: SearchLocationParams) => {
    const searchParams = new URLSearchParams();
    
    if (params?.keyword) {
      searchParams.append("keyword", params.keyword);
    }
    if (params?.pageIndex) {
      searchParams.append("pageIndex", params.pageIndex.toString());
    }
    if (params?.pageSize) {
      searchParams.append("pageSize", params.pageSize.toString());
    }
    
    const queryString = searchParams.toString();
    return axiosClient.get(
      `${endpoints.location.search}${queryString ? `?${queryString}` : ''}`
    );
  },
  
  // GET /api/vi-tri/{id} - Lấy vị trí theo ID
  getById: (id: number) => axiosClient.get(endpoints.location.getById(id)),
  
  // POST /api/vi-tri - Tạo vị trí mới
  create: (data: CreateLocationRequest) => axiosClient.post(endpoints.location.create, data),
  
  // PUT /api/vi-tri/{id} - Cập nhật vị trí
  update: (id: number, data: UpdateLocationRequest) => {
    console.log("[locationApi] Update call:", id, data);
    return axiosClient.put(endpoints.location.update(id), data)
      .then((res) => {
        console.log("[locationApi] Update response:", res);
        return res;
      })
      .catch((err) => {
        console.error("[locationApi] Update error:", err);
        throw err;
      });
  },
  
  // DELETE /api/vi-tri/{id} - Xóa vị trí
  delete: (id: number) => axiosClient.delete(endpoints.location.delete(id)),
  
  // POST /api/vi-tri/upload-hinh-vitri - Upload hình ảnh vị trí
  uploadImage: (formData: FormData) => 
    axiosClient.post(endpoints.location.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
