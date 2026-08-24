import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  maPhong: number;

  @IsNotEmpty()
  @IsString()
  noiDung: string;

  @IsInt()
  @Min(1)
  @Max(5)
  saoBinhLuan: number;
}
