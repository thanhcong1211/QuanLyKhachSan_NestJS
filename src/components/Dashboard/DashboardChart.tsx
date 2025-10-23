"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

export default function DashboardChart() {
  const { chartData, chartConfig } = useDashboardStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê Đặt phòng & Doanh thu</CardTitle>
        <CardDescription>
          Số lượng đặt phòng và doanh thu theo tháng
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 5, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="bookings"
              type="natural"
              fill="var(--color-bookings)"
              fillOpacity={0.4}
              stroke="var(--color-bookings)"
              stackId="a"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Tổng quan 6 tháng gần đây{" "}
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Dữ liệu giả lập từ hệ thống đặt phòng
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
