"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { roomService } from "@/services/roomService";
import type { Room, CreateRoomRequest } from "@/types/room.type";
import { message, Modal } from "antd";
import { storage } from "@/helpers/storage";
import { useRouter } from "next/navigation";

export default function useRoomManager(initialPageSize = 10) {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // Modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<CreateRoomRequest>({
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 0,
    hinhAnh: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAll();
      const data = response as { content?: Room[] };
      let roomsArray = Array.isArray(data.content) ? data.content : [];

      if (searchKeyword) {
        const key = searchKeyword.toLowerCase();
        roomsArray = roomsArray.filter((r) =>
          (r.tenPhong || "").toLowerCase().includes(key) ||
          String(r.maViTri || "").includes(key) ||
          String(r.giaTien || "").includes(key)
        );
      }

      const total = roomsArray.length;
      const start = (pageIndex - 1) * pageSize;
      const paginated = roomsArray.slice(start, start + pageSize);

      setRooms(paginated);
      setTotalRows(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("fetchRooms error:", err);
      message.error("Không thể tải danh sách phòng");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handleSearch = (keyword?: string) => {
    if (typeof keyword === "string") setSearchKeyword(keyword);
    setPageIndex(1);
    fetchRooms();
  };

  const openCreate = () => {
    setModalMode("create");
    setFormData({
      tenPhong: "",
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      moTa: "",
      giaTien: 0,
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: 0,
      hinhAnh: "",
    });
    setImageFile(null);
    setImagePreview("");
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setModalMode("edit");
    setSelectedRoom(room);
    setFormData({
      tenPhong: room.tenPhong || "",
      khach: room.khach || 1,
      phongNgu: room.phongNgu || 1,
      giuong: room.giuong || 1,
      phongTam: room.phongTam || 1,
      moTa: room.moTa || "",
      giaTien: room.giaTien || 0,
      mayGiat: room.mayGiat || false,
      banLa: room.banLa || false,
      tivi: room.tivi || false,
      dieuHoa: room.dieuHoa || false,
      wifi: room.wifi || false,
      bep: room.bep || false,
      doXe: room.doXe || false,
      hoBoi: room.hoBoi || false,
      banUi: room.banUi || false,
      maViTri: room.maViTri || 0,
      hinhAnh: room.hinhAnh || "",
    });
    setImagePreview(room.hinhAnh || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (room: Room) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa phòng "${room.tenPhong}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await roomService.delete(room.id);
          message.success("Xóa phòng thành công!");
          fetchRooms();
        } catch (error) {
          console.error("delete room error:", error);
          message.error("Không thể xóa phòng");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submit = async () => {
    const userToken = storage.getToken();
    if (!userToken) {
      Modal.confirm({
        title: 'Chưa đăng nhập',
        content: 'Bạn chưa đăng nhập hoặc token đã hết hạn. Bạn muốn chuyển đến trang đăng nhập?',
        okText: 'Đến đăng nhập',
        cancelText: 'Hủy',
        onOk: () => router.push('/login'),
      });
      return;
    }

    if (!formData.tenPhong || !formData.maViTri) {
      message.error("Vui lòng điền đầy đủ thông tin (tên phòng và vị trí)");
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "create") {
        const res = await roomService.create(formData);
        // Nếu backend trả content chứa id, upload image sau
        const created = (res as { content?: Room })?.content;
        if (imageFile && created?.id) {
          await roomService.uploadImage(created.id, imageFile);
        }
        message.success("Tạo phòng mới thành công!");
      } else {
        if (!selectedRoom) {
          message.error("Không tìm thấy phòng cần sửa!");
          return;
        }
        await roomService.update(selectedRoom.id, formData);
        if (imageFile && selectedRoom.id) {
          await roomService.uploadImage(selectedRoom.id, imageFile);
        }
        message.success("Cập nhật phòng thành công!");
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err) {
      console.error("submit room error:", err);
      message.error(modalMode === "create" ? "Không thể tạo phòng" : "Không thể cập nhật phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return {
    rooms,
    loading,
    searchKeyword,
    pageIndex,
    pageSize,
    totalPages,
    totalRows,
    isModalOpen,
    modalMode,
    formData,
    imagePreview,
    setFormData,
    setIsModalOpen,
    setPageIndex,
    handleSearch,
    setSearchKeyword,
    openCreate,
    openEdit,
    handleDelete,
    submit,
    handleImageChange,
  };
}
