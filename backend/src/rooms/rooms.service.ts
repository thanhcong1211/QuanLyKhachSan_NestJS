import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { paginate } from '../common/pagination';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
  ) {}

  findAll() {
    return this.roomRepo.find();
  }

  async findOne(id: number) {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Không tìm thấy phòng');
    return room;
  }

  findByLocation(maViTri: number) {
    return this.roomRepo.find({ where: { maViTri } });
  }

  create(dto: CreateRoomDto) {
    const room = this.roomRepo.create(dto);
    return this.roomRepo.save(room);
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
    Object.assign(room, dto);
    return this.roomRepo.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    await this.roomRepo.remove(room);
    return { id };
  }

  async search(
    tenPhong: string | undefined,
    maViTri: number | undefined,
    soKhach: number | undefined,
    pageIndex: number,
    pageSize: number,
  ) {
    const qb = this.roomRepo.createQueryBuilder('room');
    if (tenPhong) qb.andWhere('room.tenPhong LIKE :tenPhong', { tenPhong: `%${tenPhong}%` });
    if (maViTri) qb.andWhere('room.maViTri = :maViTri', { maViTri });
    if (soKhach) qb.andWhere('room.khach >= :soKhach', { soKhach });

    const [items, total] = await qb
      .skip((pageIndex - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return paginate(items, total, pageIndex, pageSize);
  }

  async updateImage(id: number, hinhAnh: string) {
    const room = await this.findOne(id);
    room.hinhAnh = hinhAnh;
    return this.roomRepo.save(room);
  }
}
