"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import RoomReview from "./RoomReview";

interface Props {
  roomId: number;
}

/**
 * Bọc phần Review trong vùng có thể thu gọn/mở rộng (accordion style)
 * Không ảnh hưởng logic gọi API bên trong RoomReview
 */
export default function RoomReviewSection({ roomId }: Props) {
  const [open, setOpen] = useState(true); // Mặc định mở

  return (
    <div className="border rounded-xl shadow-sm overflow-hidden bg-white mb-6">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="text-rose-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Đánh giá & Bình luận
          </h2>
        </div>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Nội dung - giữ nguyên logic RoomReview */}
      {open && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <RoomReview roomId={roomId} />
        </div>
      )}
    </div>
  );
}
