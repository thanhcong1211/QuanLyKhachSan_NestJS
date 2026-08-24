import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: true })
  gender: boolean;

  @Column({ default: 'USER' })
  role: string;
}
