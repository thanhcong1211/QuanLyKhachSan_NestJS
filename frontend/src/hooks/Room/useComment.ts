import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { commentService } from "@/services/commentService";
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from "@/types/comment.type";

export const useComment = (roomId: number) => {
  const queryClient = useQueryClient();

  // 🟢 Lấy danh sách bình luận theo mã phòng
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Comment[]>({
    queryKey: ["comments", roomId],
    queryFn: async () => {
      const res = await commentService.getById(roomId);
      // Nếu API không có dữ liệu, fallback bằng filter client
      if (!res?.length) {
        const all = await commentService.getAll();
        return all.filter((c) => c.maPhong === roomId);
      }
      return res;
    },
    enabled: !!roomId,
  });

  const comments: Comment[] = data || [];

  // 🟢 Thêm bình luận (có refetch để cập nhật dữ liệu thật)
  const createComment = useMutation<Comment | undefined, unknown, CreateCommentRequest, { previous?: Comment[] }>({
    mutationFn: (data: CreateCommentRequest) => commentService.create(data),

    // Hiển thị tạm comment trên UI (Optimistic update)
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["comments", variables.maPhong] });
      const previous = queryClient.getQueryData<Comment[]>(["comments", variables.maPhong]);

      const tempComment: Comment = {
        id: Date.now(),
        maPhong: variables.maPhong,
        maNguoiBinhLuan: 0,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: variables.noiDung,
        saoBinhLuan: variables.saoBinhLuan,
      };

      queryClient.setQueryData<Comment[]>(["comments", variables.maPhong], (old = []) => [tempComment, ...old]);
      return { previous };
    },

    // Nếu lỗi → khôi phục dữ liệu cũ
    onError: (err, variables, context) => {
      if (context?.previous) queryClient.setQueryData(["comments", variables.maPhong], context.previous);
      console.error("❌ createComment error:", err);
      message.error("Không thể gửi bình luận");
    },

    // 🟢 Khi thêm thành công → refetch lại API để đảm bảo load đúng dữ liệu backend
    onSuccess: async (data, variables) => {
      console.log("[useComment] ✅ Bình luận thêm thành công:", data);

      message.success("Bình luận đã được gửi thành công!");

      // ⚡ Refetch lại từ API thật
      await queryClient.invalidateQueries({ queryKey: ["comments", variables.maPhong] });
      await queryClient.refetchQueries({ queryKey: ["comments", variables.maPhong] });
    },
  });

  // 🟢 Cập nhật bình luận
  const updateComment = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentRequest }) => commentService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", roomId] }),
  });

  // 🟢 Xóa bình luận
  const deleteComment = useMutation({
    mutationFn: (id: number) => commentService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", roomId] }),
  });

  const isCreating = createComment.status === "pending";

  return { comments, isLoading, isError, error, refetch, createComment, updateComment, deleteComment, isCreating };
};
