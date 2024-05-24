import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class CommonData {
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @VersionColumn()
  version: number;
}
