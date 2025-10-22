"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Home, MapPin, Users as UsersIcon, Calendar, Menu, X } from "lucide-react";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface UserMenuProps {
  user: UserInfo | null;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onLogout: () => void;
}

export default function UserMenu({ user, menuOpen, onToggleMenu, onLogout }: UserMenuProps) {
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN" || user?.role === "admin";

  const handleNavigate = (path: string) => {
    router.push(path);
    onToggleMenu(); // Close menu after navigation
  };

  if (!user) {
    // Guest Menu - Not logged in
    return (
      <div className="relative">
        <button
          onClick={onToggleMenu}
          className="flex items-center gap-2 border border-white text-white rounded-full px-3 py-2 hover:shadow-md hover:text-rose-300 hover:border-rose-300 transition-all"
        >
          <Menu size={20} />
          <User size={20} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-14 bg-white border rounded-xl shadow-lg w-56 py-2 z-50">
            <button
              onClick={() => handleNavigate("/login")}
              className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-gray-100"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => handleNavigate("/register")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Đăng ký
            </button>
            <hr className="my-1" />
            <button
              onClick={() => handleNavigate("/help")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Trung tâm hỗ trợ
            </button>
          </div>
        )}
      </div>
    );
  }

  // Logged in user menu
  return (
    <div className="relative">
      <button
        onClick={onToggleMenu}
        className="flex items-center gap-2 border border-white text-white rounded-full px-3 py-2 hover:shadow-md hover:text-rose-300 hover:border-rose-300 transition-all"
      >
        <User size={20} />
        <span className="text-sm font-medium">{user.name}</span>
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-14 bg-white border rounded-xl shadow-lg w-64 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1 px-2 py-1 bg-rose-100 text-rose-600 text-xs font-semibold rounded">
                ADMIN
              </span>
            )}
          </div>

          {/* Admin Menu */}
          {isAdmin ? (
            <>
              <button
                onClick={() => handleNavigate("/profile")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <User size={16} />
                <span>Thông tin tài khoản</span>
              </button>
              <hr className="my-1" />
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Quản lý dữ liệu</p>
              </div>
              <button
                onClick={() => handleNavigate("/admin/rooms")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Home size={16} />
                <span>Quản lý phòng</span>
              </button>
              <button
                onClick={() => handleNavigate("/admin/locations")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <MapPin size={16} />
                <span>Quản lý vị trí</span>
              </button>
              <button
                onClick={() => handleNavigate("/admin/users")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <UsersIcon size={16} />
                <span>Quản lý user</span>
              </button>
              <hr className="my-1" />
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            /* Regular User Menu */
            <>
              <button
                onClick={() => handleNavigate("/profile")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <User size={16} />
                <span>Thông tin tài khoản</span>
              </button>
              <button
                onClick={() => handleNavigate("/profile/bookings")}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Calendar size={16} />
                <span>Danh sách phòng đã đặt</span>
              </button>
              <hr className="my-1" />
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
