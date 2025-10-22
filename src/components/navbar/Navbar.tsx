"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/helpers/storage";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setUser, logout as logoutAction } from "@/redux/slices/authSlice";
import UserMenu from "./UserMenu";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // ✅ Lấy user từ Redux store
  const userFromRedux = useSelector((state: RootState) => state.auth.user);

  // Log khi user thay đổi
  useEffect(() => {
    console.log("👤 Navbar - User from Redux:", userFromRedux);
    if (userFromRedux) {
      console.log("✅ Navbar đã nhận user → UserMenu sẽ hiển thị menu phù hợp");
    } else {
      console.log("ℹ️ Navbar - Chưa có user → UserMenu hiển thị Guest menu");
    }
  }, [userFromRedux]);

  // Load user từ localStorage vào Redux khi component mount
  useEffect(() => {
    if (!userFromRedux) {
      const userDataStr = storage.get("user");
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          dispatch(setUser(userData));
          console.log("📦 Loaded user from localStorage to Redux:", userData);
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
        }
      }
    }
  }, [userFromRedux, dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
    storage.remove("user");
    setMenuOpen(false);
    router.push("/");
  };

  const user = userFromRedux as UserInfo | null;

  return (
    <> 
      <header className="sticky top-0 z-100 bg-black border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-start pt-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <Image
              src="/airbnb-logo.png"
              alt="Airbnb Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-semibold text-white transition-colors group-hover:text-rose-300">
              airbnb
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center justify-center flex-1">
            <div className="flex items-center justify-between w-full max-w-md">
              <Link 
                href="/page/danhsachphong" 
                className="relative text-lg font-medium text-white pb-1 transition-colors hover:text-rose-300 group"
              >
                <span>Nơi ở</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/page/about" 
                className="relative text-lg font-medium text-white pb-1 transition-colors hover:text-rose-300 group"
              >
                <span>Trải nghiệm</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/page/contact" 
                className="relative text-lg font-medium text-white pb-1 transition-colors hover:text-rose-300 group"
              >
                <span>Liên hệ</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block text-sm font-medium text-white hover:text-rose-300 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
              Cho thuê chỗ ở
            </button>

            <UserMenu
              user={user}
              menuOpen={menuOpen}
              onToggleMenu={() => setMenuOpen(!menuOpen)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>
    </>
  );
}
