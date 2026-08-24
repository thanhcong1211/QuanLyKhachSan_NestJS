"use client";
import { MapPin, Star, Users, BedDouble, Bath, DoorOpen } from "lucide-react";
import type { Room } from "@/types/room.type";

export default function RoomInfo({ room }: { room: Room }) {
  const meta = [
    { icon: Users, label: `${room.khach} khách` },
    { icon: DoorOpen, label: `${room.phongNgu} phòng ngủ` },
    { icon: BedDouble, label: `${room.giuong} giường` },
    { icon: Bath, label: `${room.phongTam} phòng tắm` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
          {room.tenPhong}
        </h1>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600">
          <Star size={14} className="fill-rose-500 text-rose-500" />
          4.83
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
        <MapPin size={16} className="text-rose-500" />
        <span>Vị trí #{room.maViTri}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {meta.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          >
            <Icon size={16} className="text-gray-500" />
            {label}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-base font-semibold text-gray-900 mb-2">Mô tả</h4>
        <p className="text-gray-600 leading-relaxed">{room.moTa}</p>
      </div>
    </div>
  );
}
