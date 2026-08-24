import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { paginate } from '../common/pagination';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location) private readonly locationRepo: Repository<Location>,
  ) {}

  findAll() {
    return this.locationRepo.find();
  }

  async findOne(id: number) {
    const location = await this.locationRepo.findOne({ where: { id } });
    if (!location) throw new NotFoundException('Không tìm thấy vị trí');
    return location;
  }

  create(dto: CreateLocationDto) {
    const location = this.locationRepo.create(dto);
    return this.locationRepo.save(location);
  }

  async update(id: number, dto: UpdateLocationDto) {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return this.locationRepo.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    await this.locationRepo.remove(location);
    return { id };
  }

  async searchPaging(keyword: string | undefined, pageIndex: number, pageSize: number) {
    const [items, total] = await this.locationRepo.findAndCount({
      where: keyword ? { tenViTri: Like(`%${keyword}%`) } : {},
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return paginate(items, total, pageIndex, pageSize);
  }

  async updateImage(id: number, hinhAnh: string) {
    const location = await this.findOne(id);
    location.hinhAnh = hinhAnh;
    return this.locationRepo.save(location);
  }
}
