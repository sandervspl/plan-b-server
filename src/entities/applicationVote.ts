/* eslint-disable @typescript-eslint/no-unused-vars */
import * as i from 'types';
import {
  Entity, CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import User from './user';

@Entity()
class ApplicationVote {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'int',
  })
  applicationId!: number;

  @ManyToOne((type) => User, (user) => user.applicationVotes)
  user!: User;

  @Column({
    type: 'tinyint',
  })
  vote!: i.VOTE;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default ApplicationVote;
