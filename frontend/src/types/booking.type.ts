export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface CreateBookingRequest {
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number; // ✅ THÊM USER ID
}

export type UpdateBookingRequest = Partial<CreateBookingRequest>;
