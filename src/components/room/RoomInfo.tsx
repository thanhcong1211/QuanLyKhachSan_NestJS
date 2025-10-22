"use client";
import { MapPin } from "lucide-react";
import type { Room } from "@/types/room.type";

export default function RoomInfo({ room }: { room: Room }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{room.tenPhong}</h1>
      <div className="flex items-center text-gray-600 gap-3">
        <MapPin size={18} /> {room.khach} khách · {room.phongNgu} phòng ngủ · {room.giuong} giường · {room.phongTam} phòng tắm
      </div>
      <h4>Mo ta</h4>
      <p className="text-gray-700">{room.moTa}</p>
    </div>
  );
}
