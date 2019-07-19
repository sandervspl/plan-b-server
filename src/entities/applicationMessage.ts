/* eslint-disable @typescript-eslint/no-unused-vars */
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

  @ManyToOne((type) => User, (user) => user.applicationMessages)
  user!: User;

  @Column({
    type: 'text',
  })
  text!: string;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default ApplicationMessage;
