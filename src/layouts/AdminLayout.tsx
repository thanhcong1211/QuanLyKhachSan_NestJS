"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  MessageSquare, 
  Calendar,
  Menu,
  X,
  LogOut,
  MapPin
} from "lucide-react";
import LanguageSwitcher from "@/components/navbar/LanguageSwitcher";
import { useTranslations } from "@/lib/i18n";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = useTranslations("admin.layout");

  const menuItems = [
    { icon: LayoutDashboard, label: t("menu.dashboard"), path: "/admin/dashboard" },
    { icon: MapPin, label: t("menu.locations"), path: "/admin/locations" },
    { icon: Home, label: t("menu.rooms"), path: "/admin/rooms" },
    { icon: Users, label: t("menu.users"), path: "/admin/users" },
    { icon: Calendar, label: t("menu.bookings"), path: "/admin/bookings" },
    { icon: MessageSquare, label: t("menu.comments"), path: "/admin/comments" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-rose-500">{t("panelTitle")}</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>{t("logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">{t("headerTitle")}</h2>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <span className="text-sm text-gray-600">{t("headerUser")}</span>
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
