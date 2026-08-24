import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private async withAuthor(comments: Comment[]) {
    const userIds = [...new Set(comments.map((c) => c.maNguoiBinhLuan))];
    const users = userIds.length
      ? await this.userRepo.find({ where: { id: In(userIds) } })
      : [];
    const userMap = new Map(users.map((u) => [u.id, u]));

    return comments.map((c) => {
      const user = userMap.get(c.maNguoiBinhLuan);
      return {
        ...c,
        nguoiBinhLuan: user
          ? { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
          : undefined,
      };
    });
  }

  async findAll() {
    const comments = await this.commentRepo.find();
    return this.withAuthor(comments);
  }

  async findByRoom(maPhong: number) {
    const comments = await this.commentRepo.find({ where: { maPhong } });
    return this.withAuthor(comments);
  }

  async create(dto: CreateCommentDto, maNguoiBinhLuan: number) {
    const comment = this.commentRepo.create({
      ...dto,
      maNguoiBinhLuan,
      ngayBinhLuan: new Date().toISOString(),
    });
    const saved = await this.commentRepo.save(comment);
    const [withAuthor] = await this.withAuthor([saved]);
    return withAuthor;
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');
    Object.assign(comment, dto);
    const saved = await this.commentRepo.save(comment);
    const [withAuthor] = await this.withAuthor([saved]);
    return withAuthor;
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');
    await this.commentRepo.remove(comment);
    return { id };
  }
}
