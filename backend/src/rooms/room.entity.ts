import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('phong_thue')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenPhong: string;

  @Column()
  khach: number;

  @Column()
  phongNgu: number;

  @Column()
  giuong: number;

  @Column()
  phongTam: number;

  @Column('text')
  moTa: string;

  @Column()
  giaTien: number;

  @Column({ default: false })
  mayGiat: boolean;

  @Column({ default: false })
  banLa: boolean;

  @Column({ default: false })
  tivi: boolean;

  @Column({ default: false })
  dieuHoa: boolean;

  @Column({ default: false })
  wifi: boolean;

  @Column({ default: false })
  bep: boolean;

  @Column({ default: false })
  doXe: boolean;

  @Column({ default: false })
  hoBoi: boolean;

  @Column({ default: false })
  banUi: boolean;

  @Column()
  maViTri: number;

  @Column({ nullable: true })
  hinhAnh?: string;
}
