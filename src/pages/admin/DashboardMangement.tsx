"use client";
import '@ant-design/v5-patch-for-react-19';

import DashboardChart from "@/components/Dashboard/DashboardChart";
import { useDashboardStats } from "@/hooks/Dashboard/useDashboardStats";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { 
  HomeOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  DollarOutlined 
} from "@ant-design/icons";
import { formatCurrency } from "@/helpers/formatCurrency";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">Tổng quan hệ thống quản lý</p>
      </div>
      
      {/* Thống kê tổng quan - Responsive Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium text-sm">Tổng phòng</span>}
              value={stats.totalRooms}
              prefix={<HomeOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium text-sm">Tổng người dùng</span>}
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium text-sm">Tổng đặt phòng</span>}
              value={stats.totalBookings}
              prefix={<CalendarOutlined className="text-rose-500" />}
              valueStyle={{ color: '#ec4899', fontWeight: 'bold', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium text-sm">Tổng doanh thu</span>}
              value={stats.totalRevenue}
              prefix={<DollarOutlined className="text-green-600" />}
              valueStyle={{ color: '#059669', fontWeight: 'bold', fontSize: '20px' }}
              formatter={(value) => formatCurrency.toVND(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <DashboardChart />
    </div>
  );
}
