import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('binh_luan')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maPhong: number;

  @Column()
  maNguoiBinhLuan: number;

  @Column()
  ngayBinhLuan: string;

  @Column('text')
  noiDung: string;

  @Column()
  saoBinhLuan: number;
}
