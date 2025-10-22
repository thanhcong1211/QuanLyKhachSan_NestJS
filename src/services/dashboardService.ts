import { dashboardApi } from "@/api/dashboard.api";

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

      const rooms = unwrapArray(roomsRes);
      const users = unwrapArray(usersRes);
      const bookings = unwrapArray(bookingsRes);

      // ✅ Tính tổng doanh thu (nếu có dữ liệu đặt phòng)
      const safeNumber = (v: unknown): number => {
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v)) return Number(v);
        return 0;
      };

      const totalRevenue = (bookings || []).reduce((acc: number, booking: unknown) => {
        if (typeof booking !== "object" || booking === null) return acc;
        const b = booking as Record<string, unknown>;
        const soNgay = safeNumber(b["soNgay"]);
        const giaTien = safeNumber(b["giaTien"]);
        return acc + soNgay * giaTien;
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
