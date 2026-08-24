"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("admin.layout");

  const menuItems = [
    { label: t("menu.dashboard"), path: "/admin/dashboard" },
    { label: t("menu.locations"), path: "/admin/locations" },
    { label: t("menu.rooms"), path: "/admin/rooms" },
    { label: t("menu.users"), path: "/admin/users" },
    { label: t("menu.bookings"), path: "/admin/bookings" },
  ];

  const currentPage = menuItems.find(item => item.path === pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      
      {/* Admin Panel with Sidebar */}
      <SidebarProvider>
        <div className="flex flex-1 bg-gray-950">
          <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Beautiful & Modern Dark */}
          <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="px-6 py-4">
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Toggle Sidebar Button - 3 gạch ngang */}
                  <SidebarTrigger className="h-9 w-9 border border-gray-700 rounded-md hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </SidebarTrigger>
                  
                  {/* Page Title */}
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {currentPage?.label || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date().toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2 w-80 border border-gray-700">
                    <Search size={18} className="text-gray-500" />
                    <Input 
                      placeholder="Tìm kiếm..." 
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-gray-300 placeholder:text-gray-600"
                    />
                  </div>

                  {/* Notifications */}
                  <Button variant="outline" size="icon" className="h-10 w-10 relative border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-gray-900"></span>
                  </Button>

                  {/* User Profile */}
                  <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-200">Admin User</p>
                      <p className="text-xs text-gray-500">Quản trị viên</p>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="w-11 h-11 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-rose-500/30 transition-transform group-hover:scale-105">
                        A
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="hover:text-rose-400 cursor-pointer transition-colors">Admin</span>
                <span>/</span>
                <span className="text-gray-300 font-medium">{currentPage?.label || 'Dashboard'}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-900">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
