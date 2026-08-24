import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/guards/auth.guard';

@Controller('binh-luan')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('lay-binh-luan-theo-phong/:roomId')
  findByRoom(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.commentsService.findByRoom(roomId);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateCommentDto, @CurrentUser() user: JwtPayload) {
    return this.commentsService.create(dto, user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
