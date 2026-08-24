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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { buildFileUrl, multerOptions } from '../upload/multer.config';

@Controller('vi-tri')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('phan-trang-tim-kiem')
  searchPaging(
    @Query('keyword') keyword?: string,
    @Query('pageIndex') pageIndex = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    return this.locationsService.searchPaging(keyword, Number(pageIndex), Number(pageSize));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLocationDto) {
    return this.locationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }

  @Post('upload-hinh-vitri')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('formFile', multerOptions('vi-tri')))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('maViTri', ParseIntPipe) maViTri: number,
  ) {
    const url = buildFileUrl('vi-tri', file.filename);
    return this.locationsService.updateImage(maViTri, url);
  }
}
