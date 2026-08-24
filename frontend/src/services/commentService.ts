import { commentApi } from "@/api/comment.api";
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from "@/types/comment.type";

const unwrapContent = (r: unknown): unknown => {
  if (r && typeof r === "object") {
    const obj = r as Record<string, unknown>;
    if (obj.content !== undefined) return obj.content;
  }
  return r;
};

export const commentService = {

  // ✅ Lấy tất cả bình luận
  getAll: async (): Promise<Comment[]> => {
    const res: unknown = await commentApi.getAll();
    const content = unwrapContent(res);
    return Array.isArray(content) ? (content as Comment[]) : [];
  },

  // ✅ Lấy bình luận theo mã phòng
  getById: async (roomId: number): Promise<Comment[]> => {
    const res: unknown = await commentApi.getById(roomId);
    const content = unwrapContent(res);
    return Array.isArray(content) ? (content as Comment[]) : [];
  },

  // ✅ Thêm bình luận
  create: async (data: CreateCommentRequest): Promise<Comment> => {
    const res: unknown = await commentApi.create(data);
    const content = unwrapContent(res) as Comment | undefined;

    // Trả về comment có cấu trúc đầy đủ (fallback nếu backend không trả về content)
    return (
      content || {
        id: Date.now(),
        maPhong: data.maPhong,
        maNguoiBinhLuan: 0,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: data.noiDung,
        saoBinhLuan: data.saoBinhLuan,
      }
    );
  },

  // ✅ Cập nhật bình luận
  update: async (id: number, data: UpdateCommentRequest): Promise<Comment | undefined> => {
    const res: unknown = await commentApi.update(id, data);
    const content = unwrapContent(res);
    return typeof content === "object" ? (content as Comment) : undefined;
  },

  // ✅ Xóa bình luận
  delete: async (id: number) => {
    await commentApi.delete(id);
  },
};
