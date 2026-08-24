"use client";

import { useEffect, useState } from "react";
import { message, Modal } from "antd";

/**
 * Generic entity manager hook
 * - T: entity type
 * - CreateReq: create request shape
 * - UpdateReq: update request shape
 * - Service: expected shape of the service passed in
 *
 * Service must provide: getAll(), create(data), update(id, data), delete(id), optional uploadImage(id, file)
 */
export default function useEntityManager<T extends { id: number }, CreateReq = Partial<T>, UpdateReq = Partial<T>>(
  service: {
    getAll: () => Promise<unknown>;
    create?: (data: CreateReq) => Promise<unknown>;
    update?: (id: number, data: UpdateReq) => Promise<unknown>;
    delete?: (id: number) => Promise<unknown>;
    uploadImage?: (id: number, file: File) => Promise<unknown>;
  },
  initialForm: CreateReq,
  opts?: {
    pageSize?: number;
    searchFields?: (keyof T)[];
  }
) {
  const pageSizeDefault = opts?.pageSize ?? 10;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(pageSizeDefault);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<T | null>(null);
  const [formData, setFormData] = useState<CreateReq | UpdateReq>(initialForm as unknown as CreateReq | UpdateReq);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await service.getAll();
      const data = res as { content?: T[] };
      let arr = Array.isArray(data.content) ? data.content : [];

      if (searchKeyword) {
        const key = searchKeyword.toLowerCase();
        const fields = opts?.searchFields ?? (Object.keys(arr[0] || {}) as (keyof T)[]);
        arr = arr.filter((it) =>
          fields.some((f) => {
            const v = (it as unknown as Record<string, unknown>)[String(f)];
            return v !== undefined && String(v).toLowerCase().includes(key);
          })
        );
      }

      const total = arr.length;
      const start = (pageIndex - 1) * pageSize;
      const paginated = arr.slice(start, start + pageSize);

      setItems(paginated);
      setTotalRows(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("fetchItems error:", err);
      message.error("Không thể tải dữ liệu");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handleSearch = (keyword?: string) => {
    if (typeof keyword === "string") setSearchKeyword(keyword);
    setPageIndex(1);
    fetchItems();
  };

  const openCreate = () => {
    setModalMode("create");
  setFormData(initialForm as unknown as CreateReq | UpdateReq);
    setSelected(null);
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEdit = (item: T) => {
    setModalMode("edit");
    setSelected(item);
  setFormData(item as unknown as CreateReq | UpdateReq);
  setImagePreview(((item as unknown) as Record<string, unknown>).hinhAnh as string | undefined || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (item: T, label = "item") => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${label} có id ${item.id}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        if (!service.delete) return;
        try {
          setLoading(true);
          await service.delete(item.id);
          message.success("Xóa thành công!");
          fetchItems();
        } catch (error) {
          console.error("delete error:", error);
          message.error("Không thể xóa");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submit = async () => {
    try {
      setLoading(true);
      if (modalMode === "create") {
        if (!service.create) throw new Error("service.create is not implemented");
        const res = await service.create(formData as CreateReq);
        const created = (res as { content?: T })?.content;
        if (imageFile && created?.id && service.uploadImage) {
          await service.uploadImage(created.id, imageFile);
        }
        message.success("Tạo thành công!");
      } else {
        if (!selected) throw new Error("No selected item to update");
        if (!service.update) throw new Error("service.update is not implemented");
        await service.update(selected.id, formData as UpdateReq);
        if (imageFile && selected.id && service.uploadImage) {
          await service.uploadImage(selected.id, imageFile);
        }
        message.success("Cập nhật thành công!");
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      console.error("submit error:", err);
      message.error("Thao tác thất bại");
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
    items,
    loading,
    searchKeyword,
    pageIndex,
    pageSize,
    totalPages,
    totalRows,
    isModalOpen,
    modalMode,
    formData,
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
    imagePreview,
  };
}
