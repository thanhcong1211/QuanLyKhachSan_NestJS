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
}

export type UpdateBookingRequest = Partial<CreateBookingRequest>;
