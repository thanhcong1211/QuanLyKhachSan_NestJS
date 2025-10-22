"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

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

  // 🧮 Giả lập dữ liệu biểu đồ (sẽ dùng thật sau)
  const chartData: DashboardChartItem[] = [
    { label: "Jan", bookings: 12, revenue: 2300000 },
    { label: "Feb", bookings: 22, revenue: 3200000 },
    { label: "Mar", bookings: 15, revenue: 2900000 },
    { label: "Apr", bookings: 18, revenue: 3500000 },
    { label: "May", bookings: 27, revenue: 4100000 },
    { label: "Jun", bookings: 30, revenue: 4700000 },
  ];

  const chartConfig = {
    bookings: { label: "Đặt phòng", color: "var(--chart-1)" },
    revenue: { label: "Doanh thu", color: "var(--chart-2)" },
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
