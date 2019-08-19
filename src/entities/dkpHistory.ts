import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, Unique, ManyToOne,
} from 'typeorm';
import { Character } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
@Unique(['character', 'exportTime'])
class DkpHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @ManyToOne((type) => Character, (character) => character.dkpHistories, {
    eager: true,
  })
  character!: Character;

  // Gain from raid
  @Column({
    type: 'int',
  })
  net!: number;

  // Loss from raid
  @Column({
    type: 'int',
  })
  spent!: number;

  // Total DKP after this raid
  @Column({
    type: 'int',
  })
  total!: number;

  @Column({
    type: 'int',
  })
  hours!: number;

  @Column({
    type: 'varchar',
  })
  exporter!: string;

  @Column({
    type: 'int',
  })
  exportTime!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default DkpHistory;
