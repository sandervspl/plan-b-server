import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column, OneToMany, OneToOne,
  JoinColumn,
} from 'typeorm';
import ApplicationMessage from './applicationMessage';
import ApplicationVote from './applicationVote';
import Character from './character';
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

  @OneToOne((type) => Character, (character) => character.user, {
    nullable: true,
  })
  @JoinColumn()
  character?: Character;

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
