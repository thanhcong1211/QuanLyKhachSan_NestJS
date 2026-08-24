import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';
import { Room } from '../rooms/room.entity';
import { Booking } from '../bookings/booking.entity';
import { Comment } from '../comments/comment.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'airbnb_clone',
  entities: [User, Location, Room, Booking, Comment],
  synchronize: true,
};
