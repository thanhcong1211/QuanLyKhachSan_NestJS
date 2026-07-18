"use client";
import { Wifi, Snowflake, Utensils, WashingMachine, Car, Tv, Waves, Shirt, Sparkles } from "lucide-react";
import type { Room } from "@/types/room.type";

export default function RoomAmenities({ room }: { room: Room }) {
  // Danh sách tiện nghi và icon tương ứng
  const amenities = [
    { key: "wifi", label: "Wi-Fi", icon: Wifi, color: "text-rose-500 bg-rose-50" },
    { key: "dieuHoa", label: "Điều hòa", icon: Snowflake, color: "text-sky-500 bg-sky-50" },
    { key: "bep", label: "Bếp", icon: Utensils, color: "text-orange-500 bg-orange-50" },
    { key: "mayGiat", label: "Máy giặt", icon: WashingMachine, color: "text-slate-600 bg-slate-100" },
    { key: "doXe", label: "Chỗ đậu xe", icon: Car, color: "text-slate-700 bg-slate-100" },
    { key: "hoBoi", label: "Hồ bơi", icon: Waves, color: "text-blue-500 bg-blue-50" },
    { key: "tivi", label: "TV", icon: Tv, color: "text-amber-500 bg-amber-50" },
    { key: "banUi", label: "Bàn ủi", icon: Shirt, color: "text-purple-500 bg-purple-50" },
  ];

  // Lọc ra những tiện nghi mà phòng có (true)
  const availableAmenities = amenities.filter((item) => {
    const k = item.key as keyof Room;
    return Boolean(room[k]);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-rose-500" />
        <h3 className="text-lg font-semibold text-gray-900">Tiện nghi nổi bật</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableAmenities.length > 0 ? (
          availableAmenities.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                <item.icon size={16} />
              </span>
              <span>{item.label}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-full text-center py-4">
            Chưa có tiện nghi được cung cấp.
          </div>
        )}
      </div>
    </div>
  );
}
