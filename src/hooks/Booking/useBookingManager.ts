"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useState } from "react";
import { bookingService } from "@/services/bookingService";
import { useTranslations } from "@/lib/i18n";
import type { Booking, CreateBookingRequest, UpdateBookingRequest } from "@/types/booking.type";

export const useBookingManager = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("bookingManagement");
  const tc = useTranslations("common");

  // ✅ STATE CỤC BỘ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<CreateBookingRequest>({
    maPhong: 0,
    ngayDen: "",
    ngayDi: "",
    soLuongKhach: 1,
    maNguoiDung: 0,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // ✅ FETCH TẤT CẢ ĐẶT PHÒNG
  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const res = await bookingService.getAll();
      // Normalize different possible response shapes from the API / axios
      // Cases handled: { content: Booking[] }, Booking[], AxiosResponse
      let payload: unknown = res;
      if (res && typeof res === "object") {
        const obj = res as unknown as Record<string, unknown>;
        const maybeContent = obj["content"];
        const maybeData = obj["data"];
        if (Array.isArray(maybeContent)) payload = maybeContent;
        else if (Array.isArray(maybeData)) payload = maybeData;
      }
      if (Array.isArray(payload)) {
        const result = payload as Booking[];
        console.log('[useBookingManager] Fetched bookings:', result.length, 'items');
        console.log('[useBookingManager] Booking IDs:', result.map(b => b.id));
        return result;
      }
      return [];
    },
  });
  // ✅ CREATE BOOKING
  const createBooking = useMutation({
    mutationFn: async (data: CreateBookingRequest) => bookingService.create(data),
    onSuccess: async () => {
      message.success(t("messages.createSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error(t("messages.createError"));
    },
  });

  // ✅ UPDATE BOOKING
  const updateBooking = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateBookingRequest }) =>
      bookingService.update(id, data),
    onSuccess: async () => {
      message.success(t("messages.updateSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setIsModalOpen(false);
    },
    onError: () => {
      message.error(t("messages.updateError"));
    },
  });

  // ✅ DELETE BOOKING
  const deleteBooking = useMutation({
    mutationFn: async (id: number) => bookingService.delete(id),
    onSuccess: async () => {
      message.success(t("messages.deleteSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      console.error('[useBookingManager] Delete error:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const status = err?.response?.status;
      const errorMsg = err?.response?.data?.message || err?.message || 'Unknown error';
      
      if (status === 404) {
        message.error('Không tìm thấy booking để xóa');
      } else if (status === 403) {
        message.error('Không có quyền xóa booking này');
      } else {
        message.error(`Lỗi xóa booking: ${errorMsg}`);
      }
    },
  });

  // ✅ XỬ LÝ HÀNH ĐỘNG
  const openCreate = () => {
    setFormData({ maPhong: 0, ngayDen: "", ngayDi: "", soLuongKhach: 1, maNguoiDung: 0 });
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEdit = (record: Booking) => {
    setSelectedId(record.id);
    setFormData({
      maPhong: record.maPhong,
      ngayDen: record.ngayDen,
      ngayDi: record.ngayDi,
      soLuongKhach: record.soLuongKhach,
      maNguoiDung: record.maNguoiDung,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };
  const handleDelete = (record: Booking) => {
    console.log('[useBookingManager] Attempting to delete booking:', record);
    console.log('[useBookingManager] Booking ID:', record.id);
    Modal.confirm({
      title: tc("actions.confirm"),
      content: t("messages.confirmDelete").replace("#{id}", String(record.id)).replace("${id}", String(record.id)),
      okText: tc("actions.delete"),
      cancelText: tc("actions.cancel"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          console.log('[useBookingManager] Calling deleteBooking.mutateAsync with ID:', record.id);
          await deleteBooking.mutateAsync(record.id);
        } catch (err) {
          console.error("[useBookingManager] delete error:", err);
        }
      },
    });
  };
  const submit = async () => {
    if (modalMode === "create") {
      await createBooking.mutateAsync(formData);
    } else if (selectedId) {
      await updateBooking.mutateAsync({ id: selectedId, data: formData });
    }
  };

  return {
    bookings,
    isLoading,
    loading: isLoading,
    isError,
    refetch,
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    openCreate,
    openEdit,
    handleDelete,
    submit,
    deleteBooking: deleteBooking.mutateAsync,
  };
};
