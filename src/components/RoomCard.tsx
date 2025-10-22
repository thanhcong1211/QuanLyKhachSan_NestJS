"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Room } from "@/types/room.type";

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/room/${room.id}`)}
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full h-60">
        <Image
          src={room.hinhAnh || "/default-room.jpg"}
          alt={room.tenPhong}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-lg line-clamp-1">{room.tenPhong}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">
          {room.moTa?.slice(0, 60)}...
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium text-red-600">
            {room.giaTien.toLocaleString()}₫ / đêm
          </span>
          <span className="text-sm text-gray-600">
            {room.khach} khách
          </span>
        </div>
      </div>
    </div>
  );
}
