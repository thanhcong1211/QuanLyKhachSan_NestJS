import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitize(user: User) {
    const { password: _password, ...rest } = user;
    return rest;
  }

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone,
      birthday: dto.birthday,
      gender: dto.gender ?? true,
      role: 'USER',
    });
    const saved = await this.userRepo.save(user);
    return this.sanitize(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user: this.sanitize(user) };
  }
}
