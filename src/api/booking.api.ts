import axiosClient from "./axiosClient";
import { endpoints } from "@/constant/endpoints";
import type { CreateBookingRequest, UpdateBookingRequest } from "@/types/booking.type";

export const bookingApi = {
  getAll: () => axiosClient.get(endpoints.booking.getAll),
  getById: (id: number) => axiosClient.get(endpoints.booking.getById(id)),
  create: (data: CreateBookingRequest) => {
    console.log('[bookingApi] Creating booking with data:', data);
    console.log('[bookingApi] POST URL:', endpoints.booking.create);
    return axiosClient.post(endpoints.booking.create, data)
      .then((res) => {
        console.log('[bookingApi] Create SUCCESS response:', res);
        return res;
      })
      .catch((err) => {
        console.error('[bookingApi] Create ERROR:', err);
        console.error('[bookingApi] Error response:', err?.response);
        console.error('[bookingApi] Error data:', err?.response?.data);
        throw err;
      });
  },
  update: (id: number, data: UpdateBookingRequest) =>
    axiosClient.put(endpoints.booking.update(id), data),
  delete: (id: number) => {
    console.log('[bookingApi] Deleting booking with id:', id);
    console.log('[bookingApi] DELETE URL:', endpoints.booking.delete(id));
    return axiosClient.delete(endpoints.booking.delete(id))
      .then((res) => {
        console.log('[bookingApi] Delete SUCCESS response:', res);
        return res;
      })
      .catch((err) => {
        console.error('[bookingApi] Delete ERROR:', err);
        console.error('[bookingApi] Error response:', err?.response);
        console.error('[bookingApi] Error status:', err?.response?.status);
        console.error('[bookingApi] Error data:', err?.response?.data);
        throw err;
      });
  },
};
