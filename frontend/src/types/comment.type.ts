export interface Comment {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  // Thêm thông tin người bình luận nếu API có
  nguoiBinhLuan?: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
  };
}

export interface CreateCommentRequest {
  maPhong: number;
  noiDung: string;
  saoBinhLuan: number;
}

export type UpdateCommentRequest = Partial<CreateCommentRequest>;
