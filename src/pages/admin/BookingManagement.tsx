"use client";
import '@ant-design/v5-patch-for-react-19';

import { Table, Modal, Card, Row, Col, Statistic, Select, DatePicker, InputNumber, Form } from "antd";
import { CalendarOutlined, UserOutlined, HomeOutlined, DollarOutlined, MailOutlined } from "@ant-design/icons";
import { Edit, Trash2 } from "lucide-react";
import { useBookingManager } from "@/hooks/Booking/useBookingManager";
import { useTranslations } from "@/lib/i18n";
import type { Booking } from "@/types/booking.type";
import type { Room } from "@/types/room.type";
import type { Location } from "@/types/location.type";
import type { User } from "@/types/user.type";
import { useState, useEffect, useMemo } from "react";
import { roomService } from "@/services/roomService";
import { locationService } from "@/services/locationService";
import { userService } from "@/services/userService";
import { formatCurrency } from "@/helpers/formatCurrency";
import dayjs from "dayjs";
import 'dayjs/locale/vi';

const { RangePicker } = DatePicker;

dayjs.locale('vi');

export default function BookingManagementPage() {
  const t = useTranslations("bookingManagement");
  const tc = useTranslations("common");

  const {
    bookings,
    loading,
    isModalOpen,
    modalMode,
    formData,
    setFormData,
    openCreate,
    openEdit,
    handleDelete,
    submit,
    setIsModalOpen,
  } = useBookingManager();

  // Lấy danh sách phòng để map id -> tên phòng + hình ảnh
  const [roomsMap, setRoomsMap] = useState<Record<number, Room>>({});
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  // Lấy danh sách vị trí để map id -> tên vị trí
  const [locationMap, setLocationMap] = useState<Record<number, Location>>({});
  // Lấy danh sách users để map id -> tên người dùng
  const [usersMap, setUsersMap] = useState<Record<number, User>>({});

  // State cho tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState<"name" | "email">("name");

  useEffect(() => {
    // Fetch rooms
    roomService.getAll().then((res) => {
      let rooms: Room[] = [];
      if (Array.isArray(res)) {
        rooms = res;
      } else if (res && typeof res === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res as any;
        if (Array.isArray(data.content)) {
          rooms = data.content;
        }
      }
      setRoomsList(rooms);
      const map: Record<number, Room> = {};
      rooms.forEach((room) => { map[room.id] = room; });
      setRoomsMap(map);
    }).catch(() => {
      // Ignore errors
    });

    // Fetch locations
    locationService.getAll().then((res) => {
      let locations: Location[] = [];
      if (Array.isArray(res)) {
        locations = res;
      } else if (res && typeof res === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res as any;
        if (Array.isArray(data.content)) {
          locations = data.content;
        }
      }
      const map: Record<number, Location> = {};
      locations.forEach((loc) => { map[loc.id] = loc; });
      setLocationMap(map);
    }).catch(() => {
      // Ignore errors
    });

    // Fetch users
    userService.getAll().then((res) => {
      let users: User[] = [];
      if (Array.isArray(res)) {
        users = res;
      } else if (res && typeof res === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res as any;
        if (Array.isArray(data.content)) {
          users = data.content;
        }
      }
      const map: Record<number, User> = {};
      users.forEach((user) => { map[user.id] = user; });
      setUsersMap(map);
    }).catch(() => {
      // Ignore errors
    });
  }, []);

  // Filter bookings theo search
  const filteredBookings = useMemo(() => {
    if (!searchKeyword.trim()) {
      return bookings;
    }

    const keyword = searchKeyword.toLowerCase();

    return bookings.filter((booking) => {
      const user = usersMap[booking.maNguoiDung];
      if (!user) return false;

      if (searchType === "name") {
        return (user.name || "").toLowerCase().includes(keyword);
      } else if (searchType === "email") {
        return (user.email || "").toLowerCase().includes(keyword);
      }
      return false;
    });
  }, [bookings, searchKeyword, searchType, usersMap]);

  // Tính tổng tiền tất cả booking (dùng filteredBookings)
  const totalRevenue = useMemo(() => {
    return filteredBookings.reduce((sum, booking) => {
      const room = roomsMap[booking.maPhong];
      if (!room) return sum;

      const checkIn = dayjs(booking.ngayDen);
      const checkOut = dayjs(booking.ngayDi);
      const nights = checkOut.diff(checkIn, 'day');
      const price = room.giaTien * nights;

      return sum + price;
    }, 0);
  }, [filteredBookings, roomsMap]);

  const columns = [
    { 
      title: t("table.id"), 
      dataIndex: "id",
      width: 70,
      render: (id: number) => <span className="font-medium text-gray-900">{id}</span>
    },
    {
      title: "Người đặt",
      dataIndex: "maNguoiDung",
      width: 180,
      render: (maNguoiDung: number) => {
        const user = usersMap[maNguoiDung];
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">
                {user?.name || 'Không rõ'}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                {user?.email || `#${maNguoiDung}`}
              </span>
            </div>
          </div>
        );
      }
    },
    { 
      title: t("table.room"), 
      dataIndex: "maPhong",
      width: 200,
      render: (maPhong: number) => {
        const room = roomsMap[maPhong];
        const location = room ? locationMap[room.maViTri] : null;
        return (
          <div className="flex items-center gap-2">
            {room?.hinhAnh ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={room.hinhAnh}
                alt={room.tenPhong || `Room #${maPhong}`}
                className="w-12 h-12 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <HomeOutlined style={{ fontSize: 16 }} className="text-gray-400" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm truncate max-w-[100px]">
                {room?.tenPhong || `#${maPhong}`}
              </span>
              {location && (
                <span className="text-xs text-gray-500 truncate max-w-[100px]">
                  {location.tenViTri}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    { 
      title: "Thời gian", 
      dataIndex: "ngayDen",
      width: 180,
      render: (_: string, record: Booking) => {
        const checkIn = dayjs(record.ngayDen);
        const checkOut = dayjs(record.ngayDi);
        const nights = checkOut.diff(checkIn, 'day');
        
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs">
              <CalendarOutlined className="text-blue-500" />
              <span className="font-medium text-gray-900">{checkIn.format('DD/MM')}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium text-gray-900">{checkOut.format('DD/MM')}</span>
            </div>
            <span className="text-xs text-gray-500">
              {nights} đêm
            </span>
          </div>
        );
      }
    },
    { 
      title: t("table.guests"), 
      dataIndex: "soLuongKhach",
      width: 80,
      align: 'center' as const,
      render: (guests: number) => (
        <div className="flex items-center justify-center gap-1">
          <UserOutlined className="text-green-500" style={{ fontSize: 14 }} />
          <span className="font-medium text-gray-900">{guests}</span>
        </div>
      )
    },
    {
      title: "Giá tiền",
      dataIndex: "maPhong",
      width: 140,
      render: (_: number, record: Booking) => {
        const room = roomsMap[record.maPhong];
        if (!room) return <span className="text-gray-400">-</span>;

        const checkIn = dayjs(record.ngayDen);
        const checkOut = dayjs(record.ngayDi);
        const nights = checkOut.diff(checkIn, 'day');
        const totalPrice = room.giaTien * nights;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-green-600 text-sm">
              {formatCurrency.toVND(totalPrice)}
            </span>
            <span className="text-xs text-gray-500">
              {formatCurrency.toVND(room.giaTien)}/đêm
            </span>
          </div>
        );
      }
    },
    {
      title: t("table.actions"),
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: Booking) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => openEdit(record)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={tc("actions.edit")}
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={tc("actions.delete")}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-1">
                {t("title")}
              </h2>
              <p className="text-sm text-gray-600">Quản lý tất cả đặt phòng</p>
            </div>
            <button 
              onClick={openCreate} 
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg shadow-rose-500/30 text-sm sm:text-base whitespace-nowrap"
            >
              + {t("modal.createTitle")}
            </button>
          </div>

          {/* Search Box - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Type Selector */}
            <div className="w-full sm:w-48">
              <Select
                value={searchType}
                onChange={(value) => setSearchType(value as "name" | "email")}
                className="w-full"
                size="large"
                options={[
                  { value: "name", label: "🔍 Tìm theo tên" },
                  { value: "email", label: "📧 Tìm theo email" },
                ]}
              />
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                {searchType === "name" ? (
                  <UserOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" style={{ fontSize: 16 }} />
                ) : (
                  <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" style={{ fontSize: 16 }} />
                )}
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder={
                    searchType === "name"
                      ? "Nhập tên người đặt phòng..."
                      : "Nhập email người đặt..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Result Badge - Hidden on mobile if no search */}
            {searchKeyword && (
              <div className="flex items-center justify-center sm:justify-start gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-lg whitespace-nowrap">
                <CalendarOutlined />
                <span className="font-medium text-sm sm:text-base">{filteredBookings.length} kết quả</span>
              </div>
            )}
          </div>
        </div>

        {/* Card tổng kết - Responsive Grid */}
        <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title={searchKeyword ? "Booking tìm thấy" : "Tổng số booking"}
                value={filteredBookings.length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: searchKeyword ? '#1890ff' : '#3f8600' }}
                suffix={searchKeyword ? `/ ${bookings.length}` : undefined}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title={searchKeyword ? "Doanh thu (đã lọc)" : "Tổng doanh thu"}
                value={totalRevenue}
                precision={0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#cf1322' }}
                formatter={(value) => formatCurrency.toVND(Number(value))}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Card>
              <Statistic
                title="Doanh thu trung bình/booking"
                value={filteredBookings.length > 0 ? totalRevenue / filteredBookings.length : 0}
                precision={0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                formatter={(value) => formatCurrency.toVND(Number(value))}
              />
            </Card>
          </Col>
        </Row>

        {/* Table - Responsive Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              loading={loading}
              columns={columns}
              dataSource={filteredBookings}
              rowKey="id"
              bordered
              scroll={{ x: 1000 }}
              className="admin-table-pagination"
              pagination={{ 
              pageSize: 10,
              showTotal: (total) => `${total} booking(s)`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              locale: {
                items_per_page: '',
              },
            }}
          />
          </div>
        </div>

      {/* Global Styles - Dark Pagination */}
      <style jsx global>{`
        .admin-table-pagination .ant-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background-color: rgba(17, 24, 39, 0.5);
          border-top: 1px solid rgb(55, 65, 81);
        }
        
        .admin-table-pagination .ant-pagination-total-text {
          color: rgb(156, 163, 175);
          font-size: 0.813rem;
          margin-right: auto;
        }
        
        .admin-table-pagination .ant-pagination-item {
          background-color: rgb(31, 41, 55);
          border: 1px solid rgb(55, 65, 81);
          min-width: 32px;
          height: 32px;
          line-height: 30px;
          margin: 0;
        }
        
        .admin-table-pagination .ant-pagination-item a {
          color: rgb(209, 213, 219);
          font-size: 0.875rem;
        }
        
        .admin-table-pagination .ant-pagination-item:hover {
          background-color: rgb(55, 65, 81);
        }
        
        .admin-table-pagination .ant-pagination-item:hover a {
          color: white;
        }
        
        .admin-table-pagination .ant-pagination-item-active {
          background: linear-gradient(to right, #ec4899, #f472b6);
          border-color: transparent;
        }
        
        .admin-table-pagination .ant-pagination-item-active a {
          color: white;
        }
        
        .admin-table-pagination .ant-pagination-prev,
        .admin-table-pagination .ant-pagination-next,
        .admin-table-pagination .ant-pagination-jump-prev,
        .admin-table-pagination .ant-pagination-jump-next {
          background-color: rgb(31, 41, 55);
          border: 1px solid rgb(55, 65, 81);
          min-width: 32px;
          height: 32px;
          margin: 0;
        }
        
        .admin-table-pagination .ant-pagination-prev button,
        .admin-table-pagination .ant-pagination-next button,
        .admin-table-pagination .ant-pagination-jump-prev button,
        .admin-table-pagination .ant-pagination-jump-next button {
          color: rgb(209, 213, 219);
        }
        
        .admin-table-pagination .ant-pagination-prev:hover,
        .admin-table-pagination .ant-pagination-next:hover,
        .admin-table-pagination .ant-pagination-jump-prev:hover,
        .admin-table-pagination .ant-pagination-jump-next:hover {
          background-color: rgb(55, 65, 81);
        }
        
        .admin-table-pagination .ant-pagination-prev:hover button,
        .admin-table-pagination .ant-pagination-next:hover button,
        .admin-table-pagination .ant-pagination-jump-prev:hover button,
        .admin-table-pagination .ant-pagination-jump-next:hover button {
          color: white;
        }
        
        .admin-table-pagination .ant-pagination-disabled {
          opacity: 0.4;
        }
        
        .admin-table-pagination .ant-pagination-options {
          margin-left: auto;
        }
        
        .admin-table-pagination .ant-select-selector {
          background-color: rgb(31, 41, 55) !important;
          border-color: rgb(55, 65, 81) !important;
          color: rgb(209, 213, 219) !important;
          height: 32px !important;
          padding: 0 8px !important;
        }
        
        .admin-table-pagination .ant-select-selection-item {
          line-height: 30px !important;
          font-size: 0.875rem !important;
        }
        
        .admin-table-pagination .ant-select-arrow {
          color: rgb(209, 213, 219);
        }
      `}</style>

      <Modal
        open={isModalOpen}
        title={modalMode === "create" ? t("modal.createTitle") : t("modal.editTitle")}
        onCancel={() => setIsModalOpen(false)}
        onOk={submit}
        width={800}
        okText={modalMode === "create" ? "Tạo booking" : "Cập nhật"}
        cancelText="Hủy"
        className="booking-modal"
        styles={{
          body: { maxHeight: '70vh', overflowY: 'auto' }
        }}
      >
        <Form layout="vertical" className="mt-4">
          {/* Chọn phòng */}
          <Form.Item label="Phòng" required>
            <Select
              showSearch
              placeholder="Chọn phòng"
              value={formData.maPhong || undefined}
              onChange={(value) => setFormData({ ...formData, maPhong: value })}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={roomsList.map((room) => ({
                value: room.id,
                label: `${room.tenPhong} - ${formatCurrency.toVND(room.giaTien)}/đêm`,
                room: room,
              }))}
              optionRender={(option) => {
                const room = option.data.room as Room;
                const location = locationMap[room.maViTri];
                return (
                  <div className="flex items-center gap-2 py-1">
                    {room.hinhAnh ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={room.hinhAnh} 
                        alt={room.tenPhong}
                        className="w-12 h-9 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 rounded flex items-center justify-center">
                        <HomeOutlined className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{room.tenPhong}</div>
                      <div className="text-xs text-gray-500">
                        {location ? `${location.tenViTri}, ${location.tinhThanh}` : `ID: ${room.id}`} · {formatCurrency.toVND(room.giaTien)}/đêm
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </Form.Item>

          {/* Chọn ngày */}
          <Form.Item label="Ngày nhận/trả phòng" required>
            <RangePicker
              className="w-full"
              format="DD/MM/YYYY"
              placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
              value={
                formData.ngayDen && formData.ngayDi
                  ? [dayjs(formData.ngayDen), dayjs(formData.ngayDi)]
                  : null
              }
              onChange={(dates) => {
                if (dates) {
                  setFormData({
                    ...formData,
                    ngayDen: dates[0]?.format('YYYY-MM-DD') || '',
                    ngayDi: dates[1]?.format('YYYY-MM-DD') || '',
                  });
                } else {
                  setFormData({
                    ...formData,
                    ngayDen: '',
                    ngayDi: '',
                  });
                }
              }}
              size="large"
            />
          </Form.Item>

          {/* Số khách */}
          <Form.Item label="Số lượng khách" required>
            <InputNumber
              className="w-full"
              min={1}
              max={20}
              placeholder="Nhập số khách"
              prefix={<UserOutlined />}
              value={formData.soLuongKhach}
              onChange={(value) => setFormData({ ...formData, soLuongKhach: value || 1 })}
              size="large"
            />
          </Form.Item>

          {/* Tóm tắt */}
          {formData.maPhong && formData.ngayDen && formData.ngayDi && (
            <div className="bg-rose-50 p-3 sm:p-4 rounded-lg border border-rose-200">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <DollarOutlined className="text-rose-600" />
                Tóm tắt đặt phòng
              </h4>
              {(() => {
                const room = roomsMap[formData.maPhong];
                if (!room) return null;
                const nights = dayjs(formData.ngayDi).diff(dayjs(formData.ngayDen), 'day');
                const total = room.giaTien * nights;
                return (
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phòng:</span>
                      <span className="font-medium">{room.tenPhong}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số đêm:</span>
                      <span className="font-medium">{nights} đêm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá/đêm:</span>
                      <span className="font-medium">{formatCurrency.toVND(room.giaTien)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-rose-200">
                      <span className="font-semibold">Tổng cộng:</span>
                      <span className="font-bold text-rose-600">{formatCurrency.toVND(total)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
