import axiosClient from "@/api/axiosClient";

export const dashboardApi = {
  getRooms: () => axiosClient.get("/phong-thue"),
  getUsers: () => axiosClient.get("/users"),
  getBookings: () => axiosClient.get("/dat-phong"),
};
