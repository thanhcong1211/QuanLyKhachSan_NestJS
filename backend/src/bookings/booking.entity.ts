import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dat_phong')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maPhong: number;

  @Column()
  ngayDen: string;

  @Column()
  ngayDi: string;

  @Column()
  soLuongKhach: number;

  @Column()
  maNguoiDung: number;
}
