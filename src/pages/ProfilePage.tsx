"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { User, Mail, Phone, Calendar } from "lucide-react";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthday: user?.birthday || "",
    gender: user?.gender ?? true,
  });

  const handleSave = () => {
    // TODO: Implement update user profile
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <Button onClick={() => window.location.href = "/login"}>
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-12 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-rose-500 text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-rose-100 mt-1">ID: #{user.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Lưu</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <Input
                leftIcon={<User size={18} />}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                leftIcon={<Mail size={18} />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <Input
                leftIcon={<Phone size={18} />}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <Input
                type="date"
                leftIcon={<Calendar size={18} />}
                value={formData.birthday}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                value={formData.gender ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value === "true" })
                }
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
              >
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
                {user.role || "Người dùng"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
