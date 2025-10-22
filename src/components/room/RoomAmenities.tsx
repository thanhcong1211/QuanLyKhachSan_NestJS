"use client";
import { Wifi, Snowflake, Utensils, WashingMachine, Car, Tv, Waves } from "lucide-react";
import type { Room } from "@/types/room.type";

export default function RoomAmenities({ room }: { room: Room }) {
  // Danh sách tiện nghi và icon tương ứng
  const amenities = [
    { key: "wifi", label: "Wi-Fi", icon: <Wifi size={18} className="text-rose-500" /> },
    { key: "dieuHoa", label: "Điều hòa", icon: <Snowflake size={18} className="text-blue-400" /> },
    { key: "bep", label: "Bếp", icon: <Utensils size={18} className="text-orange-500" /> },
    { key: "mayGiat", label: "Máy giặt", icon: <WashingMachine size={18} className="text-gray-600" /> },
    { key: "doXe", label: "Chỗ đậu xe", icon: <Car size={18} className="text-gray-800" /> },
    { key: "hoBoi", label: "Hồ bơi", icon: <Waves size={18} className="text-blue-500" /> },
    { key: "tivi", label: "TV", icon: <Tv size={18} className="text-yellow-500" /> },
  { key: "banUi", label: "Bàn ủi", icon: <span className="text-gray-500">🧺</span> },
  ];

  // Lọc ra những tiện nghi mà phòng có (true)
  const availableAmenities = amenities.filter((item) => {
    const k = item.key as keyof Room;
    return Boolean(room[k]);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-3">Tiện nghi nổi bật</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm text-gray-700">
        {availableAmenities.length > 0 ? (
          availableAmenities.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-full">
            Chưa có tiện nghi được cung cấp.
          </div>
        )}
      </div>
    </div>
  );
}
