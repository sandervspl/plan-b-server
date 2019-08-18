import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column,
} from 'typeorm';
import { User } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class DkpHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @ManyToMany((type) => User)
  @JoinTable()
  user!: User;

  @Column({
    type: 'varchar',
  })
  exporter!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default DkpHistory;
