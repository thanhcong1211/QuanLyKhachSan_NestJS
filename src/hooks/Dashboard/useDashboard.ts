import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export const useDashboard = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
  });

  return {
    stats: data || { totalRooms: 0, totalUsers: 0, totalBookings: 0, totalRevenue: 0 },
    isLoading,
    isError,
    error,
    refetch,
  };
};
