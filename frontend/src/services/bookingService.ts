import { bookingApi } from "@/api/booking.api";

export const bookingService = {
  getAll: bookingApi.getAll,
  getById: bookingApi.getById,
  create: bookingApi.create,
  update: bookingApi.update,
  delete: bookingApi.delete,
};
