"use client";
import '@ant-design/v5-patch-for-react-19';
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Modal, Form, DatePicker, InputNumber, Select } from "antd";
import { CalendarOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "@/lib/i18n";
import { useBookingManager } from "@/hooks/Booking/useBookingManager";
import { roomService } from "@/services/roomService";
import { bookingService } from "@/services/bookingService";
import type { Room } from "@/types/room.type";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function UserBookingsPage() {
  const t = useTranslations("bookingPage");
  const {
    bookings,
    isLoading,
    deleteBooking,
    isModalOpen,
    setIsModalOpen,
    openCreate,
    refetch,
  } = useBookingManager();

  const [roomsMap, setRoomsMap] = useState<Record<number, Room>>({});
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomService.getAll();
        let rooms: Room[] = [];
        if (Array.isArray(res)) {
          rooms = res;
        } else if (res && typeof res === 'object' && res !== null) {
          if ('data' in res && res.data && typeof res.data === 'object' && Array.isArray(res.data.content)) {
            rooms = res.data.content;
          } else if ('content' in res && Array.isArray(res.content)) {
            rooms = res.content;
          }
        }
        const map: Record<number, Room> = {};
        rooms.forEach((room) => {
          map[room.id] = room;
        });
        setRoomsMap(map);
        setAllRooms(rooms);
      } catch (err) {
        console.error('Lỗi lấy danh sách phòng:', err);
      }
    };
    fetchRooms();
  }, []);

  // Debug logs sau khi data load
  useEffect(() => {
    console.log('=== DEBUG BOOKING FILTER ===');
    console.log('👤 Current user:', user);
    console.log('👤 Current user ID:', user?.id, '(type:', typeof user?.id, ')');
    console.log('📋 Total bookings count:', bookings.length);
    console.log('📋 All bookings:', bookings);
    console.log('🔍 Booking user IDs:', bookings.map(b => ({ 
      bookingId: b.id, 
      userId: b.maNguoiDung, 
      userIdType: typeof b.maNguoiDung,
      matches: Number(b.maNguoiDung) === Number(user?.id)
    })));
    
    // Filter right here to verify
    const filtered = user ? bookings.filter(b => Number(b.maNguoiDung) === Number(user.id)) : [];
    console.log('✅ Filtered user bookings COUNT:', filtered.length);
    console.log('✅ Filtered user bookings DATA:', filtered);
    console.log('===========================');
  }, [bookings, user]);

  // Table columns giống admin nhưng chỉ hiển thị dữ liệu của user hiện tại
  const handleDelete = async (id: number) => {
    try {
      await deleteBooking(id);
      message.success(t('messages.deleteSuccess'));
    } catch {
      message.error(t('messages.deleteError'));
    }
  };

  const handleCreateBooking = () => {
    form.resetFields();
    openCreate();
  };

  const handleSubmitBooking = async () => {
    try {
      console.log('🔍 Starting booking submission...');
      const values = await form.validateFields();
      console.log('📝 Form values:', values);
      
      if (!user?.id) {
        message.error('Vui lòng đăng nhập để đặt phòng!');
        return;
      }
      
      const [checkIn, checkOut] = values.dateRange;
      console.log('📅 Check-in:', checkIn.format('YYYY-MM-DD'));
      console.log('📅 Check-out:', checkOut.format('YYYY-MM-DD'));
      
      // ✅ Chuyển sang ISO format với timezone Z
      const bookingData = {
        maPhong: values.maPhong,
        ngayDen: checkIn.toISOString(), // ISO format: 2025-11-01T03:30:30.175Z
        ngayDi: checkOut.toISOString(),  // ISO format: 2025-11-01T03:30:30.176Z
        soLuongKhach: values.soLuongKhach,
        maNguoiDung: Number(user.id),
      };
      
      console.log('📦 Booking data to send:', bookingData);
      console.log('👤 Current user:', user);
      
      // Gọi API create booking
      const response = await bookingService.create(bookingData);
      console.log('✅ Booking created successfully:', response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resData = response as any;
      console.log('✅ Created booking ID:', resData?.content?.id);
      console.log('✅ Created booking maNguoiDung:', resData?.content?.maNguoiDung);
      
      setIsModalOpen(false);
      form.resetFields();
      message.success(t('messages.bookingSuccess'));
      
      // Đợi 1 giây để backend lưu xong, sau đó refetch
      console.log('⏳ Waiting 1s for backend to persist...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🔄 Refetching bookings...');
      await refetch();
      console.log('✅ Bookings refetched');
      console.log('📋 New bookings count:', bookings.length);
    } catch (err) {
      console.error('❌ Full error object:', err);
      console.error('❌ Error message:', err instanceof Error ? err.message : 'Unknown error');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = err as any;
      console.error('❌ Error response:', axiosError?.response?.data);
      
      const errorMsg = axiosError?.response?.data?.message || 
                      axiosError?.message || 
                      t('messages.bookingError');
      message.error(errorMsg);
    }
  };

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id',
      width: 60,
      fixed: 'left' as const,
    },
    {
      title: t('room'),
      dataIndex: 'maPhong',
      width: 300,
      fixed: 'left' as const,
      render: (maPhong: number) => {
        const room = roomsMap[maPhong];
        return (
          <div className="flex items-center gap-3">
            {room?.hinhAnh ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={room.hinhAnh}
                alt={room.tenPhong || `${t('room')} #${maPhong}`}
                className="w-20 h-16 object-cover rounded-lg border border-border shadow-sm"
              />
            ) : (
              <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                <UserOutlined style={{ fontSize: 24 }} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-base">
                {room?.tenPhong || `Phòng #${maPhong}`}
              </span>
              <span className="text-sm text-muted-foreground">
                ID: {maPhong}
              </span>
            </div>
          </div>
        );
      }
    },
    { 
      title: t('checkIn'), 
      dataIndex: 'ngayDen', 
      width: 130,
      render: (ngayDen: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-primary" />
          <span>{new Date(ngayDen).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    { 
      title: t('checkOut'), 
      dataIndex: 'ngayDi', 
      width: 130,
      render: (ngayDi: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-primary" />
          <span>{new Date(ngayDi).toLocaleDateString('vi-VN')}</span>
        </div>
      )
    },
    { 
      title: t('guests'), 
      dataIndex: 'soLuongKhach', 
      width: 100,
      render: (so: number) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-primary" />
          <span className="font-medium">{so}</span>
        </div>
      )
    },
    {
      title: t('totalPrice'),
      key: 'total',
      width: 250,
      render: (record: {
        id: number;
        maPhong: number;
        ngayDen: string;
        ngayDi: string;
        soLuongKhach: number;
        maNguoiDung: number;
      }) => {
        const room = roomsMap[record.maPhong];
        if (!room || typeof room.giaTien !== 'number') {
          return <span className="text-muted-foreground">{t('loading')}</span>;
        }
        const nights = Math.max(1, Math.ceil((new Date(record.ngayDi).getTime() - new Date(record.ngayDen).getTime()) / (1000 * 60 * 60 * 24)));
        const pricePerNight = room.giaTien;
        const total = pricePerNight * nights;
        
        return (
          <div className="flex flex-col gap-1">
            <div className="text-sm text-muted-foreground">
              {pricePerNight.toLocaleString('vi-VN')} ₫ × {nights} {t('nights')}
            </div>
            <div className="font-bold text-primary text-lg">
              {total.toLocaleString('vi-VN')} ₫
            </div>
          </div>
        );
      }
    },
    {
      title: t('delete'),
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, record: { id: number }) => (
        <Popconfirm
          title={t('deleteConfirm')}
          onConfirm={() => handleDelete(record.id)}
          okText={t('delete')}
          cancelText={t('cancel')}
        >
          <Button danger size="small">{t('delete')}</Button>
        </Popconfirm>
      ),
    },
  ];

  // Filter bookings theo user đang đăng nhập (convert về number để đảm bảo so sánh đúng)
  const userBookings = user 
    ? bookings.filter(b => {
        const bookingUserId = Number(b.maNguoiDung);
        const currentUserId = Number(user.id);
        return bookingUserId === currentUserId;
      })
    : [];

  console.log('� [RENDER] userBookings:', userBookings);
  console.log('🔄 [RENDER] userBookings.length:', userBookings.length);
  console.log('🔄 [RENDER] bookings.length:', bookings.length);
  console.log('🔄 [RENDER] user?.id:', user?.id);

  // Tính tổng tiền tất cả phòng đã đặt của user
  const totalAll = userBookings.reduce((sum, booking) => {
    const room = roomsMap[booking.maPhong];
    if (!room || typeof room.giaTien !== 'number') return sum;
    const nights = Math.max(1, Math.ceil((new Date(booking.ngayDi).getTime() - new Date(booking.ngayDen).getTime()) / (1000 * 60 * 60 * 24)));
    return sum + room.giaTien * nights;
  }, 0);

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          {user && (
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />}
              onClick={handleCreateBooking}
              className="shadow-md"
            >
              {t('createButton')}
            </Button>
          )}
        </div>
        
        {!user ? (
          <div className="text-center bg-card rounded-lg shadow-md py-20 border border-border">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-xl text-muted-foreground">{t('loginToView')}</div>
          </div>
        ) : (
          <>
            {userBookings.length > 0 && (
              <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('totalBookings')}</div>
                    <div className="text-3xl font-bold text-primary">{userBookings.length} {t('bookings')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">{t('totalCost')}</div>
                    <div className="text-3xl font-bold text-primary">{totalAll.toLocaleString('vi-VN')} ₫</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
              <Table
                loading={isLoading}
                columns={columns}
                dataSource={userBookings}
                rowKey="id"
                bordered
                scroll={{ x: 1200 }}
                pagination={{ 
                  pageSize: 6,
                  showTotal: (total) => t('showTotal', { total }),
                  showSizeChanger: false,
                }}
                locale={{ emptyText: t('noBookings') }}
              />
            </div>
          </>
        )}

        {/* Modal đặt phòng */}
        <Modal
          title={<div className="text-xl font-bold">📅 {t('modal.title')}</div>}
          open={isModalOpen}
          onOk={handleSubmitBooking}
          onCancel={() => setIsModalOpen(false)}
          okText={t('modal.okText')}
          cancelText={t('modal.cancelText')}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            className="mt-6"
          >
            <Form.Item
              label={t('modal.selectRoom')}
              name="maPhong"
              rules={[{ required: true, message: t('modal.selectRoomError') }]}
            >
              <Select
                placeholder={t('modal.selectRoomPlaceholder')}
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {allRooms.map(room => (
                  <Select.Option key={room.id} value={room.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{room.tenPhong}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-primary font-medium">
                        {room.giaTien?.toLocaleString('vi-VN')} ₫{t('modal.perNight')}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('modal.stayDuration')}
              name="dateRange"
              rules={[{ required: true, message: t('modal.dateRangeError') }]}
            >
              <RangePicker 
                size="large"
                className="w-full"
                format="DD/MM/YYYY"
                placeholder={[t('modal.dateRangePlaceholder.0'), t('modal.dateRangePlaceholder.1')]}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label={t('modal.guestCount')}
              name="soLuongKhach"
              initialValue={1}
              rules={[
                { required: true, message: t('modal.guestCountError') },
                { type: 'number', min: 1, message: t('modal.guestCountMin') }
              ]}
            >
              <InputNumber
                size="large"
                className="w-full"
                min={1}
                max={20}
                placeholder={t('modal.guestCountPlaceholder')}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}