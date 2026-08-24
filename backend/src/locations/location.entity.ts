import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vi_tri')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenViTri: string;

  @Column()
  tinhThanh: string;

  @Column()
  quocGia: string;

  @Column({ nullable: true })
  hinhAnh?: string;
}
