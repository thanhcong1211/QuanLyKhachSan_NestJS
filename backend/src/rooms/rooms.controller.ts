import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { buildFileUrl, multerOptions } from '../upload/multer.config';

@Controller('phong-thue')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get('lay-phong-theo-vi-tri')
  findByLocation(@Query('maViTri', ParseIntPipe) maViTri: number) {
    return this.roomsService.findByLocation(maViTri);
  }

  @Get('phan-trang-tim-kiem')
  search(
    @Query('tenPhong') tenPhong?: string,
    @Query('maViTri') maViTri?: string,
    @Query('soKhach') soKhach?: string,
    @Query('pageIndex') pageIndex = '1',
    @Query('pageSize') pageSize = '100',
  ) {
    return this.roomsService.search(
      tenPhong,
      maViTri ? Number(maViTri) : undefined,
      soKhach ? Number(soKhach) : undefined,
      Number(pageIndex),
      Number(pageSize),
    );
  }

  @Post('upload-hinh-phong')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('formFile', multerOptions('phong-thue')))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('maPhong', ParseIntPipe) maPhong: number,
  ) {
    const url = buildFileUrl('phong-thue', file.filename);
    return this.roomsService.updateImage(maPhong, url);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }
}
