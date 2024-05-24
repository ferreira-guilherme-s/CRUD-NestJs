import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonData } from '../user.module';

@Entity('userTest')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column(() => CommonData, { prefix: '' })
  data: CommonData;
}
