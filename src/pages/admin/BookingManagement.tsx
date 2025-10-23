"use client";

import { Table, Button, Modal, Input, Space } from "antd";
import { useBookingManager } from "@/hooks/Booking/useBookingManager";
import { useTranslations } from "@/lib/i18n";
import type { Booking } from "@/types/booking.type";

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

  const columns = [
    { title: t("table.id"), dataIndex: "id" },
    { title: t("table.room"), dataIndex: "maPhong" },
    { title: t("table.checkIn"), dataIndex: "ngayDen" },
    { title: t("table.checkOut"), dataIndex: "ngayDi" },
    { title: t("table.guests"), dataIndex: "soLuongKhach" },
    {
      title: t("table.actions"),
      render: (_: unknown, record: Booking) => (
        <Space>
          <Button onClick={() => openEdit(record)}>{tc("actions.edit")}</Button>
          <Button danger onClick={() => handleDelete(record)}>{tc("actions.delete")}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <Button type="primary" onClick={openCreate}>+ {t("modal.createTitle")}</Button>
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
        title={modalMode === "create" ? t("modal.createTitle") : t("modal.editTitle")}
        onCancel={() => setIsModalOpen(false)}
        onOk={submit}
      >
        <div className="space-y-3">
          <Input
            placeholder={t("modal.roomPlaceholder")}
            type="number"
            value={formData.maPhong}
            onChange={(e) => setFormData({ ...formData, maPhong: Number(e.target.value) })}
          />
          <Input
            placeholder={t("modal.checkInPlaceholder")}
            value={formData.ngayDen}
            onChange={(e) => setFormData({ ...formData, ngayDen: e.target.value })}
          />
          <Input
            placeholder={t("modal.checkOutPlaceholder")}
            value={formData.ngayDi}
            onChange={(e) => setFormData({ ...formData, ngayDi: e.target.value })}
          />
          <Input
            placeholder={t("modal.guestsPlaceholder")}
            type="number"
            value={formData.soLuongKhach}
            onChange={(e) => setFormData({ ...formData, soLuongKhach: Number(e.target.value) })}
          />
        </div>
      </Modal>
    </div>
  );
}
