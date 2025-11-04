import { dashboardApi } from "@/api/dashboard.api";
import type { Booking } from "@/types/booking.type";
import type { Room } from "@/types/room.type";
import dayjs from "dayjs";

export const dashboardService = {
  getStats: async () => {
    try {
      const [roomsRes, usersRes, bookingsRes] = await Promise.all([
        dashboardApi.getRooms(),
        dashboardApi.getUsers(),
        dashboardApi.getBookings(),
      ]);

      // ✅ Kiểm tra có content hay không (tùy theo backend trả về)
      const unwrapArray = (r: unknown): unknown[] => {
        if (r && typeof r === "object") {
          const obj = r as Record<string, unknown>;
          if (Array.isArray(obj.content)) return obj.content as unknown[];
        }
        if (Array.isArray(r)) return r as unknown[];
        return [];
      };

      const rooms = unwrapArray(roomsRes) as Room[];
      const users = unwrapArray(usersRes);
      const bookings = unwrapArray(bookingsRes) as Booking[];

      // Tạo map phòng để lấy giá
      const roomsMap: Record<number, Room> = {};
      rooms.forEach((room) => {
        roomsMap[room.id] = room;
      });

      // ✅ Tính tổng doanh thu từ booking data thực
      const totalRevenue = bookings.reduce((acc: number, booking: Booking) => {
        const room = roomsMap[booking.maPhong];
        if (!room) return acc;

        const checkIn = dayjs(booking.ngayDen);
        const checkOut = dayjs(booking.ngayDi);
        const nights = checkOut.diff(checkIn, 'day');
        const revenue = room.giaTien * nights;

        return acc + revenue;
      }, 0);

      return {
        totalRooms: rooms?.length || 0,
        totalUsers: users?.length || 0,
        totalBookings: bookings?.length || 0,
        totalRevenue,
      };
    } catch (error) {
      console.error("[dashboardService] getStats error:", error);
      return { totalRooms: 0, totalUsers: 0, totalBookings: 0, totalRevenue: 0 };
    }
  },
};
