"use client";

import { Table, Button, Modal, Input, Space } from "antd";
import { useBookingManager } from "@/hooks/Booking/useBookingManager";

export default function BookingManagementPage() {
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

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Phòng", dataIndex: "maPhong" },
    { title: "Ngày đến", dataIndex: "ngayDen" },
    { title: "Ngày đi", dataIndex: "ngayDi" },
    { title: "Số khách", dataIndex: "soLuongKhach" },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Quản lý Đặt phòng</h2>
        <Button type="primary" onClick={openCreate}>+ Thêm đặt phòng</Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        bordered
      />

      <Modal
        open={isModalOpen}
        title={modalMode === "create" ? "Thêm đặt phòng" : "Cập nhật đặt phòng"}
        onCancel={() => setIsModalOpen(false)}
        onOk={submit}
      >
        <div className="space-y-3">
          <Input
            placeholder="Mã phòng"
            type="number"
            value={formData.maPhong}
            onChange={(e) => setFormData({ ...formData, maPhong: Number(e.target.value) })}
          />
          <Input
            placeholder="Ngày đến (YYYY-MM-DD)"
            value={formData.ngayDen}
            onChange={(e) => setFormData({ ...formData, ngayDen: e.target.value })}
          />
          <Input
            placeholder="Ngày đi (YYYY-MM-DD)"
            value={formData.ngayDi}
            onChange={(e) => setFormData({ ...formData, ngayDi: e.target.value })}
          />
          <Input
            placeholder="Số lượng khách"
            type="number"
            value={formData.soLuongKhach}
            onChange={(e) => setFormData({ ...formData, soLuongKhach: Number(e.target.value) })}
          />
        </div>
      </Modal>
    </div>
  );
}
