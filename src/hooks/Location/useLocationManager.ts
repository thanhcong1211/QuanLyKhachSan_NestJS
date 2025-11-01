"use client";
import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { locationService } from "@/services/locationService";
import type { Location } from "@/types/location.type";
import { message, Modal } from "antd";
import { useTranslations } from "@/lib/i18n";
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
  const t = useTranslations("locationManagement");
  const tc = useTranslations("common");

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
      message.error(t("errors.fetchList"));
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
    const userStr = storage.get("user");
    let userRole = null;
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        userRole = userData?.role;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    // ⚠️ Kiểm tra quyền ADMIN trước khi xóa
    if (userRole !== "ADMIN") {
      message.error("Chỉ ADMIN mới có quyền xóa vị trí!");
      console.warn("⚠️ User role:", userRole, "- Required: ADMIN");
      return;
    }
    
    Modal.confirm({
      title: tc("actions.confirm"),
      content: t("confirmDelete").replace("{name}", loc.tenViTri || "").replace("{id}", String(loc.id)),
      okText: tc("actions.delete"),
      cancelText: tc("actions.cancel"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await locationService.delete(loc.id);
          message.success(t("messages.deleteSuccess"));
          fetchLocations();
        } catch (error) {
          console.error("delete error:", error);
          message.error(t("errors.delete"));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submit = async () => {
    const userToken = storage.getToken();
    const userStr = storage.get("user");
    let userRole = null;
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        userRole = userData?.role;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    if (!userToken) {
      Modal.confirm({
        title: tc("actions.confirm"),
        content: t("errors.notAuthenticated"),
        okText: t("actions.goToLogin") || tc("actions.confirm"),
        cancelText: tc("actions.cancel"),
        onOk: () => router.push('/login'),
      });
      return;
    }
    
    // ⚠️ Kiểm tra quyền ADMIN
    if (userRole !== "ADMIN") {
      message.error("Chỉ ADMIN mới có quyền thực hiện chức năng này!");
      console.warn("⚠️ User role:", userRole, "- Required: ADMIN");
      return;
    }

    if (!formData.tenViTri || !formData.tinhThanh || !formData.quocGia) {
      message.error(t("errors.missingRequired"));
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "create") {
        await locationService.createWithImage(formData, imageFile || undefined);
        message.success(t("messages.createSuccess"));
      } else {
        if (!selectedLocation) {
          message.error("Không tìm thấy vị trí cần sửa!");
          return;
        }
        await locationService.updateWithImage(selectedLocation.id, formData, imageFile || undefined);
        message.success(t("messages.updateSuccess"));
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error("submit error:", err);
      message.error(modalMode === "create" ? t("errors.create") : t("errors.update"));
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
