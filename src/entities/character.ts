import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { DkpHistory } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class Character {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

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
