import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
  ) {}

  findAll() {
    return this.bookingRepo.find();
  }

  async findOne(id: number) {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Không tìm thấy đặt phòng');
    return booking;
  }

  create(dto: CreateBookingDto) {
    const booking = this.bookingRepo.create(dto);
    return this.bookingRepo.save(booking);
  }

  async update(id: number, dto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    return this.bookingRepo.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    await this.bookingRepo.remove(booking);
    return { id };
  }
}
