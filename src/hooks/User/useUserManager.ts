"use client";

import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import type { User, UpdateUserRequest } from "@/types/user.type";
import { message, Modal } from "antd";
import { useTranslations } from "@/lib/i18n";

export default function useUserManager(initialPageSize = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  // Modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<UpdateUserRequest>>({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    avatar: "",
    gender: true,
    role: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      const data = response as { content?: User[] };
      let usersArray = Array.isArray(data.content) ? data.content : [];

      if (searchKeyword) {
        const key = searchKeyword.toLowerCase();
        usersArray = usersArray.filter((u) =>
          (u.name || "").toLowerCase().includes(key) ||
          (u.email || "").toLowerCase().includes(key) ||
          (u.phone || "").toLowerCase().includes(key)
        );
      }

      const total = usersArray.length;
      const start = (pageIndex - 1) * pageSize;
      const paginated = usersArray.slice(start, start + pageSize);

      setUsers(paginated);
      setTotalRows(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("fetchUsers error:", err);
      message.error(t("errors.fetchList"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const handleSearch = (keyword?: string) => {
    if (typeof keyword === "string") setSearchKeyword(keyword);
    setPageIndex(1);
    fetchUsers();
  };

  const openCreate = () => {
    setModalMode("create");
    setFormData({ name: "", email: "", phone: "", birthday: "", avatar: "", gender: true, role: "" });
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEdit = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: tc("actions.confirm"),
      content: t("confirmDelete").replace("{name}", user.name || "").replace("{id}", String(user.id)),
      okText: tc("actions.delete"),
      cancelText: tc("actions.cancel"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await userService.delete(user.id);
          message.success(t("messages.deleteSuccess"));
          fetchUsers();
        } catch (error) {
          console.error("delete user error:", error);
          message.error(t("errors.delete"));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const submit = async () => {
    if (!formData.name || !formData.email) {
      message.error(t("errors.missingRequired"));
      return;
    }

    setLoading(true);
    try {
      if (modalMode === "create") {
        await userService.create(formData);
        message.success(t("messages.createSuccess"));
      } else {
        if (!selectedUser) {
          message.error("Không tìm thấy người dùng cần sửa!");
          return;
        }
  await userService.update(selectedUser.id, formData as UpdateUserRequest);
        message.success(t("messages.updateSuccess"));
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("submit user error:", err);
      message.error(modalMode === "create" ? t("errors.create") : t("errors.update"));
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
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
  };
}
