import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne,
} from 'typeorm';
import { DkpHistory, User } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class Character {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @OneToOne((type) => User, (user) => user.character, {
    nullable: true,
  })
  user!: User;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'int',
    default: 0,
  })
  dkp!: number;

  @OneToMany((type) => DkpHistory, (DkpHistory) => DkpHistory.character)
  dkpHistories!: DkpHistory[];

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default Character;
