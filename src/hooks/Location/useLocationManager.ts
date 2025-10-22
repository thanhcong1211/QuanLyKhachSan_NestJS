"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { locationService } from "@/services/locationService";
import type { Location } from "@/types/location.type";
import { message, Modal } from "antd";
import { storage } from "@/helpers/storage";
import { useRouter } from "next/navigation";

export default function useLocationManager(initialPageSize = 10) {
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // Modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
    hinhAnh: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationService.getAll();
      const data = response as { content?: Location[] };
      let locationsArray = Array.isArray(data.content) ? data.content : [];

      if (searchKeyword) {
        locationsArray = locationsArray.filter((loc) =>
          (loc.tenViTri || "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (loc.tinhThanh || "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (loc.quocGia || "").toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      const total = locationsArray.length;
      const start = (pageIndex - 1) * pageSize;
      const paginated = locationsArray.slice(start, start + pageSize);

      setLocations(paginated);
      setTotalRows(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("fetchLocations error:", err);
      message.error("Không thể tải danh sách vị trí");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handleSearch = (keyword?: string) => {
    if (typeof keyword === "string") setSearchKeyword(keyword);
    setPageIndex(1);
    // fetchLocations will run via effect or call explicitly
    fetchLocations();
  };

  const openCreate = () => {
    setModalMode("create");
    setFormData({ tenViTri: "", tinhThanh: "", quocGia: "", hinhAnh: "" });
    setImageFile(null);
    setImagePreview("");
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const openEdit = (loc: Location) => {
    setModalMode("edit");
    setSelectedLocation(loc);
    setFormData({
      tenViTri: loc.tenViTri || "",
      tinhThanh: loc.tinhThanh || "",
      quocGia: loc.quocGia || "",
      hinhAnh: loc.hinhAnh || "",
    });
    setImagePreview(loc.hinhAnh || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (loc: Location) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa vị trí "${loc.tenViTri}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await locationService.delete(loc.id);
          message.success("Xóa vị trí thành công!");
          fetchLocations();
        } catch (error) {
          console.error("delete error:", error);
          message.error("Không thể xóa vị trí");
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

    if (!formData.tenViTri || !formData.tinhThanh || !formData.quocGia) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "create") {
        await locationService.createWithImage(formData, imageFile || undefined);
        message.success("Tạo vị trí mới thành công!");
      } else {
        if (!selectedLocation) {
          message.error("Không tìm thấy vị trí cần sửa!");
          return;
        }
        await locationService.updateWithImage(selectedLocation.id, formData, imageFile || undefined);
        message.success("Cập nhật vị trí thành công!");
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error("submit error:", err);
      message.error(modalMode === "create" ? "Không thể tạo vị trí" : "Không thể cập nhật vị trí");
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
    locations,
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
