import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { CreateBookingRequest, UpdateBookingRequest } from "@/types/booking.type";

export const bookingApi = {
  getAll: () => axiosClient.get(endpoints.booking.getAll),
  getById: (id: number) => axiosClient.get(endpoints.booking.getById(id)),
  create: (data: CreateBookingRequest) => axiosClient.post(endpoints.booking.create, data),
  update: (id: number, data: UpdateBookingRequest) =>
    axiosClient.put(endpoints.booking.update(id), data),
  delete: (id: number) => axiosClient.delete(endpoints.booking.delete(id)),
};
