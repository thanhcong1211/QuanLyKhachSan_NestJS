import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  maPhong: number;

  @IsNotEmpty()
  @IsString()
  ngayDen: string;

  @IsNotEmpty()
  @IsString()
  ngayDi: string;

  @IsInt()
  @Min(1)
  soLuongKhach: number;

  @IsInt()
  maNguoiDung: number;
}
