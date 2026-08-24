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
      
      // Sử dụng API phân trang từ backend
      const response = await userService.searchPaging({
        keyword: searchKeyword || undefined,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      
      console.log("📊 Full API response:", response);
      console.log("📊 Response type:", typeof response);
      console.log("📊 Response keys:", Object.keys(response || {}));
      
      // Thử nhiều cấu trúc response khác nhau
      let usersArray: User[] = [];
      let total = 0;
      
      // Cấu trúc 1: { content: { data: [], totalRow: x } }
      if (response && typeof response === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = response as any;
        
        if (r.content?.data) {
          usersArray = Array.isArray(r.content.data) ? r.content.data : [];
          total = r.content.totalRow || 0;
          console.log("✅ Using structure: content.data");
        }
        // Cấu trúc 2: { content: [] }
        else if (Array.isArray(r.content)) {
          usersArray = r.content;
          total = usersArray.length;
          console.log("✅ Using structure: content (array)");
        }
        // Cấu trúc 3: { data: [], totalRow: x }
        else if (r.data) {
          usersArray = Array.isArray(r.data) ? r.data : [];
          total = r.totalRow || r.total || 0;
          console.log("✅ Using structure: data");
        }
        // Cấu trúc 4: Direct array
        else if (Array.isArray(r)) {
          usersArray = r;
          total = usersArray.length;
          console.log("✅ Using structure: direct array");
        }
      }
      
      setUsers(usersArray);
      setTotalRows(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      
      console.log("📊 Final state:", {
        usersCount: usersArray.length,
        totalRows: total,
        currentPage: pageIndex,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize)
      });
      
      // 🔍 LOG FIRST 3 USERS WITH THEIR IDs
      console.log("👥 First 3 users from API:");
      usersArray.slice(0, 3).forEach((user, idx) => {
        console.log(`  User ${idx + 1}:`, {
          id: user.id,
          idType: typeof user.id,
          name: user.name,
          email: user.email
        });
      });
    } catch (err) {
      console.error("❌ fetchUsers error:", err);
      message.error(t("errors.fetchList"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, searchKeyword]);

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
    console.log("🗑️ Attempting to delete user:", user);
    console.log("🗑️ User ID type:", typeof user.id);
    console.log("🗑️ User ID value:", user.id);
    
    // Kiểm tra user ID hợp lệ
    if (!user.id || user.id <= 0) {
      message.error("User ID không hợp lệ!");
      console.error("❌ Invalid user ID:", user.id);
      return;
    }
    
    Modal.confirm({
      title: tc("actions.confirm"),
      content: `Bạn có chắc muốn xóa user "${user.name}" (ID: ${user.id}) không?`,
      okText: tc("actions.delete"),
      cancelText: tc("actions.cancel"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          console.log("🔄 Calling userService.delete with id:", user.id);
          const result = await userService.delete(user.id);
          console.log("✅ User deleted successfully, result:", result);
          message.success(`Đã xóa user "${user.name}" thành công!`);
          // Reload danh sách users
          await fetchUsers();
        } catch (error) {
          console.error("❌ delete user error:", error);
          
          // Hiển thị message lỗi chi tiết hơn
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error("❌ Error message:", errorMessage);
          
          if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
            message.warning(
              `⚠️ BACKEND KHÔNG HỖ TRỢ XÓA USER!\n\nUser "${user.name}" (ID: ${user.id}) không thể xóa vì API backend không hỗ trợ chức năng này.\n\nVui lòng liên hệ quản trị viên hệ thống.`,
              5
            );
          } else if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
            message.error("Bạn không có quyền xóa người dùng này!");
          } else {
            message.error(`Xóa user thất bại: ${errorMessage}`);
          }
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
