import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  tenPhong: string;

  @IsInt()
  @Min(1)
  khach: number;

  @IsInt()
  @Min(0)
  phongNgu: number;

  @IsInt()
  @Min(0)
  giuong: number;

  @IsInt()
  @Min(0)
  phongTam: number;

  @IsNotEmpty()
  @IsString()
  moTa: string;

  @IsInt()
  @Min(0)
  giaTien: number;

  @IsBoolean()
  mayGiat: boolean;

  @IsBoolean()
  banLa: boolean;

  @IsBoolean()
  tivi: boolean;

  @IsBoolean()
  dieuHoa: boolean;

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  bep: boolean;

  @IsBoolean()
  doXe: boolean;

  @IsBoolean()
  hoBoi: boolean;

  @IsBoolean()
  banUi: boolean;

  @IsInt()
  maViTri: number;

  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
