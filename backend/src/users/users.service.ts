import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginate } from '../common/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private sanitize(user: User) {
    const { password: _password, ...rest } = user;
    return rest;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return this.sanitize(user);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email đã được sử dụng');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashed });
    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    await this.userRepo.remove(user);
    return { id };
  }

  async searchPaging(keyword: string | undefined, pageIndex: number, pageSize: number) {
    const [users, total] = await this.userRepo.findAndCount({
      where: keyword ? { name: Like(`%${keyword}%`) } : {},
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return paginate(users.map((u) => this.sanitize(u)), total, pageIndex, pageSize);
  }

  async searchByName(name: string) {
    const users = await this.userRepo.find({ where: { name: Like(`%${name}%`) } });
    return users.map((u) => this.sanitize(u));
  }
}
