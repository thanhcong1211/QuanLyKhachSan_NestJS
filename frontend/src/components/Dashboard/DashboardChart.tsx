"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useDashboardStats } from "@/hooks/Dashboard/useDashboardStats";
import { formatCurrency } from "@/helpers/formatCurrency";

export default function DashboardChart() {
  const { chartData, chartConfig } = useDashboardStats();

  // Tính tổng bookings và revenue
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê Đặt phòng & Doanh thu</CardTitle>
        <CardDescription>
          Số lượng đặt phòng và doanh thu 6 tháng gần đây
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency.toVNDCompact(value)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  indicator="line"
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return formatCurrency.toVND(Number(value));
                    }
                    return value;
                  }}
                />
              }
            />
            <Area
              yAxisId="left"
              dataKey="bookings"
              type="monotone"
              fill="#ec4899"
              fillOpacity={0.4}
              stroke="#ec4899"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="revenue"
              type="monotone"
              fill="#f472b6"
              fillOpacity={0.4}
              stroke="#f472b6"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Tổng: {totalBookings} đặt phòng · {formatCurrency.toVND(totalRevenue)}
              <TrendingUp className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Dữ liệu thực từ hệ thống đặt phòng
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
