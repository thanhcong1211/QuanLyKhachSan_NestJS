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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('phan-trang-tim-kiem')
  searchPaging(
    @Query('keyword') keyword?: string,
    @Query('pageIndex') pageIndex = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    return this.usersService.searchPaging(keyword, Number(pageIndex), Number(pageSize));
  }

  @Get('search/:name')
  searchByName(@Param('name') name: string) {
    return this.usersService.searchByName(name);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // Frontend gọi DELETE /users?id= thay vì /users/:id
  @Delete()
  @UseGuards(AuthGuard)
  remove(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
