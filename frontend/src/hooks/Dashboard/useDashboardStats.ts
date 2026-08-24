"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { bookingApi } from "@/api/booking.api";
import { roomService } from "@/services/roomService";
import type { Booking } from "@/types/booking.type";
import type { Room } from "@/types/room.type";
import dayjs from "dayjs";

export interface DashboardStats {
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface DashboardChartItem {
  label: string;
  bookings: number;
  revenue: number;
}

export const useDashboardStats = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  // Lấy booking data thực để tạo biểu đồ
  const { data: bookingsData } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: bookingApi.getAll,
  });

  const { data: roomsData } = useQuery({
    queryKey: ["all-rooms"],
    queryFn: roomService.getAll,
  });

  // Tạo map phòng để lấy giá
  const roomsMap: Record<number, Room> = {};
  let rooms: Room[] = [];
  if (Array.isArray(roomsData)) {
    rooms = roomsData;
  } else if (roomsData && typeof roomsData === 'object') {
    const data = roomsData as { content?: Room[] };
    if (Array.isArray(data.content)) {
      rooms = data.content;
    }
  }
  rooms.forEach((room) => { roomsMap[room.id] = room; });

  // Lấy bookings array
  let bookings: Booking[] = [];
  if (Array.isArray(bookingsData)) {
    bookings = bookingsData;
  } else if (bookingsData && typeof bookingsData === 'object') {
    const data = bookingsData as { content?: Booking[] };
    if (Array.isArray(data.content)) {
      bookings = data.content;
    }
  }

  // 🧮 Tính toán dữ liệu biểu đồ từ bookings thực
  const chartData: DashboardChartItem[] = (() => {
    // Nhóm bookings theo tháng
    const monthlyData: Record<string, { bookings: number; revenue: number }> = {};

    bookings.forEach((booking) => {
      const month = dayjs(booking.ngayDen).format('MMM YYYY');
      const room = roomsMap[booking.maPhong];
      
      if (!monthlyData[month]) {
        monthlyData[month] = { bookings: 0, revenue: 0 };
      }

      monthlyData[month].bookings += 1;

      if (room) {
        const nights = dayjs(booking.ngayDi).diff(dayjs(booking.ngayDen), 'day');
        const revenue = room.giaTien * nights;
        monthlyData[month].revenue += revenue;
      }
    });

    // Lấy 6 tháng gần nhất
    const months: DashboardChartItem[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = dayjs().subtract(i, 'month');
      const monthKey = date.format('MMM YYYY');
      const monthLabel = date.format('MMM');
      
      months.push({
        label: monthLabel,
        bookings: monthlyData[monthKey]?.bookings || 0,
        revenue: monthlyData[monthKey]?.revenue || 0,
      });
    }

    return months;
  })();

  const chartConfig = {
    bookings: { label: "Đặt phòng", color: "#ec4899" },
    revenue: { label: "Doanh thu", color: "#f472b6" },
  };

  return {
    stats: stats ?? {
      totalRooms: 0,
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
    chartData,
    chartConfig,
    isLoading,
    isError,
    error,
    refetch,
  };
};
