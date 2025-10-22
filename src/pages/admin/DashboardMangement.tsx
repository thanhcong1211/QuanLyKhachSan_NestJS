"use client";

import DashboardChart from "@/components/Dashboard/DashboardChart";
import { useDashboardStats } from "@/hooks/Dashboard/useDashboardStats";

export default function DashboardPage() {
  const { stats } = useDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Tổng phòng</p>
          <h2 className="text-2xl font-semibold">{stats.totalRooms}</h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Tổng người dùng</p>
          <h2 className="text-2xl font-semibold">{stats.totalUsers}</h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Tổng đặt phòng</p>
          <h2 className="text-2xl font-semibold">{stats.totalBookings}</h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-gray-500">Doanh thu</p>
          <h2 className="text-2xl font-semibold">
            {stats.totalRevenue.toLocaleString("vi-VN")}đ
          </h2>
        </div>
      </div>

      <DashboardChart />
    </div>
  );
}
