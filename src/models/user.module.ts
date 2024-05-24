import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonData {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
