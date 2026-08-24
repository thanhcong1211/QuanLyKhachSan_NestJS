"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar,
  MapPin,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "@/lib/i18n";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("admin.layout");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: t("menu.dashboard"), 
      path: "/admin/dashboard",
      badge: null,
    },
    { 
      icon: MapPin, 
      label: t("menu.locations"), 
      path: "/admin/locations",
      badge: null,
    },
    { 
      icon: Home, 
      label: t("menu.rooms"), 
      path: "/admin/rooms",
      badge: null,
    },
    { 
      icon: Users, 
      label: t("menu.users"), 
      path: "/admin/users",
      badge: null,
    },
    { 
      icon: Calendar, 
      label: t("menu.bookings"), 
      path: "/admin/bookings",
      badge: "New",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo');
    router.push("/");
  };

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-950">
      {/* Header - Beautiful Logo */}
      <SidebarHeader className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950">
        <div className={`flex items-center gap-3 px-4 py-5 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Home size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-gray-400 font-medium">Airbnb Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-3 py-4 bg-gray-950">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      isActive={isActive}
                      onClick={() => router.push(item.path)}
                      tooltip={isCollapsed ? item.label : undefined}
                      className={`
                        cursor-pointer rounded-lg transition-all duration-200 group relative
                        ${isCollapsed ? 'justify-center' : ''}
                        ${isActive 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40' 
                          : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                        }
                      `}
                    >
                      <Icon 
                        size={20} 
                        className={`
                          transition-transform duration-200 group-hover:scale-110
                          ${isActive ? 'text-white' : 'text-gray-400'}
                        `}
                      />
                      {!isCollapsed && (
                        <>
                          <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                            {item.label}
                          </span>
                          {item.badge && !isActive && (
                            <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-400 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r-full"></div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!isCollapsed && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton className="cursor-pointer rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
                    <BarChart3 size={20} className="text-gray-400" />
                    <span className="font-medium">Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="cursor-pointer rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white">
                    <Settings size={20} className="text-gray-400" />
                    <span className="font-medium">Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - Beautiful Logout */}
      <SidebarFooter className="border-t border-gray-800 bg-gray-900 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="cursor-pointer rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              {!isCollapsed && <span className="font-semibold">Đăng xuất</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
