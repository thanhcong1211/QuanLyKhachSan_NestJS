"use client";

import { useState } from "react";
import { useComment } from "@/hooks/Room/useComment";
import { message, Rate, Spin } from "antd";
import { Send } from "lucide-react";

interface Props {
  roomId: number;
}

const AVATAR_COLORS = [
  "bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500",
  "bg-sky-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function RoomReview({ roomId }: Props) {
  const { comments, isLoading, isError, error, refetch, createComment } = useComment(roomId);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      setIsSubmitting(true);

      await createComment.mutateAsync({
        maPhong: roomId,
        noiDung: newComment,
        saoBinhLuan: rating,
      });

      message.success("Bình luận đã được gửi thành công!");
      setNewComment("");
      setRating(5);
    } catch (err: unknown) {
      console.error("❌ Lỗi khi gửi bình luận:", err);

      const getStatus = (value: unknown): number | undefined => {
        if (typeof value !== "object" || value === null) return undefined;
        const obj = value as Record<string, unknown>;
        const s = obj["status"] ?? obj["statusCode"];
        if (typeof s === "number") return s;
        if (typeof s === "string" && /^\d+$/.test(s)) return Number(s);
        return undefined;
      };

      const status = getStatus(err);

      if (status === 403) {
        message.error("Bạn cần đăng nhập để gửi bình luận");
      } else {
        message.error("Không thể gửi bình luận");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4">Đánh giá & Bình luận</h2>
          <div className="text-sm text-gray-500">
            Mã phòng: <span className="font-medium text-gray-700">{roomId}</span>
          </div>
        </div>
        <div className="text-red-600">
          Không thể tải bình luận: {error instanceof Error ? error.message : String(error)}
        </div>
        <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-rose-500 text-white rounded">
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold mb-4">Đánh giá & Bình luận</h2>
        <div className="text-sm text-gray-500">
          Mã phòng: <span className="font-medium text-gray-700">{roomId}</span>
        </div>
      </div>

      {/* 🔽 DANH SÁCH BÌNH LUẬN (có thanh cuộn) */}
      <div
        className="space-y-4 mb-6 pr-2"
        style={{
          maxHeight: "380px",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 animate-fadeIn">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(c.maNguoiBinhLuan)}`}
              >
                {c.nguoiBinhLuan?.name?.charAt(0)?.toUpperCase() || "K"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="font-medium text-gray-900">
                    {c.nguoiBinhLuan?.name || `Khách #${c.maNguoiBinhLuan}`}
                  </span>
                  <Rate disabled defaultValue={c.saoBinhLuan} className="text-sm" />
                </div>
                <p className="mt-1 text-gray-600 leading-relaxed">{c.noiDung}</p>
                <div className="mt-1 text-xs text-gray-400">
                  {new Date(c.ngayBinhLuan).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">Chưa có bình luận nào.</p>
        )}
      </div>

      {/* 📝 Form nhập bình luận */}
      <div className="border-t border-gray-100 pt-4 sticky bottom-0 bg-white">
        <h4 className="font-medium text-gray-900 mb-2">Viết bình luận của bạn</h4>
        <Rate value={rating} onChange={(v) => setRating(v)} />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Chia sẻ cảm nhận của bạn..."
          className="w-full border border-gray-200 rounded-xl p-3 mt-2 outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`mt-3 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
            isSubmitting
              ? "bg-gray-300 text-gray-600 cursor-wait"
              : "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/30"
          }`}
        >
          {isSubmitting ? (
            <>
              <Spin size="small" /> <span>Đang gửi...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              Gửi bình luận
            </>
          )}
        </button>
      </div>
    </div>
  );
}
