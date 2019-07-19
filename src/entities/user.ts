import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column, OneToMany,
} from 'typeorm';
import ApplicationMessage from './applicationMessage';
import ApplicationVote from './applicationVote';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class User {
  // Discord ID
  @PrimaryColumn({
    type: 'varchar',
  })
  id!: string;

  @Column({
    type: 'varchar',
  })
  username!: string;

  @Column({
    type: 'varchar',
  })
  avatar!: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  authLevel!: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  dkp!: number;

  @OneToMany((type) => ApplicationMessage, (message) => message.user)
  applicationMessages!: ApplicationMessage[];

  @OneToMany((type) => ApplicationVote, (vote) => vote.user)
  applicationVotes!: ApplicationVote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default User;
