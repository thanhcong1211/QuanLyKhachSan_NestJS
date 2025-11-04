import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { CreateRoomRequest, UpdateRoomRequest } from "@/types/room.type";

export interface SearchRoomParams {
  locationId?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  keyword?: string;
}

export const roomApi = {
  getAll: () => axiosClient.get(endpoints.room.getAll),
  getById: (id: number) => axiosClient.get(endpoints.room.getById(id)),
  getByLocation: (locationId: number) => 
    axiosClient.get(endpoints.room.getByLocation(locationId)),
  search: (params: SearchRoomParams) => {
    const searchParams = new URLSearchParams();
    
    if (params.locationId) {
      searchParams.append("maViTri", params.locationId.toString());
    }
    if (params.keyword) {
      searchParams.append("tenPhong", params.keyword);
    }
    if (params.guests) {
      searchParams.append("soKhach", params.guests.toString());
    }
    
    return axiosClient.get(`${endpoints.room.search}?${searchParams.toString()}`);
  },
  create: (data: CreateRoomRequest) => 
    axiosClient.post(endpoints.room.create, data),
  
  update: (id: number, data: UpdateRoomRequest) => 
    axiosClient.put(endpoints.room.update(id), data),
  
  delete: (id: number) => 
    axiosClient.delete(endpoints.room.delete(id)),
  
  uploadImage: (formData: FormData) =>
    axiosClient.post(endpoints.room.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
