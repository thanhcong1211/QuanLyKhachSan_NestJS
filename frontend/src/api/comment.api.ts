import  axiosClient  from "@/api/axiosClient";
import type { Comment, CreateCommentRequest } from "@/types/comment.type";



export const commentApi = {
  getAll: () => axiosClient.get("/binh-luan"),
  
  // ✅ Lấy bình luận theo mã phòng (đúng endpoint backend)
  getById: (roomId: number) => axiosClient.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`),

  create: (data: CreateCommentRequest) => axiosClient.post("/binh-luan", data),

  update: (id: number, data: Partial<Comment>) => axiosClient.put(`/binh-luan/${id}`, data),

  delete: (id: number) => axiosClient.delete(`/binh-luan/${id}`),
};
