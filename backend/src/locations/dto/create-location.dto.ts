import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  tenViTri: string;

  @IsNotEmpty()
  @IsString()
  tinhThanh: string;

  @IsNotEmpty()
  @IsString()
  quocGia: string;

  @IsOptional()
  @IsString()
  hinhAnh?: string;
}
