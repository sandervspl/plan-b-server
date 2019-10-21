/* eslint-disable @typescript-eslint/no-unused-vars */
import * as i from 'types';
import {
  Entity, CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import User from './user';

@Entity()
class ApplicationMessage {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'int',
  })
  applicationId!: number;

  @ManyToOne((type) => User, (user) => user.applicationMessages, {
    eager: true,
  })
  user!: User;

  @Column({
    type: 'text',
    collation: 'utf8mb4_bin', // Supports emojis
  })
  text!: string;

  @Column({
    type: 'tinyint',
    default: i.PUBLIC_MESSAGE.PRIVATE,
  })
  public!: i.PUBLIC_MESSAGE;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default ApplicationMessage;
