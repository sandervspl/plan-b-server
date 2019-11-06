import {
  Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { Character, DkpEvent } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class DkpHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @ManyToOne((type) => Character, (character) => character.dkpHistories)
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

  @ManyToOne((type) => DkpEvent, (dkpEvent) => dkpEvent.dkpHistory)
  event!: DkpEvent;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default DkpHistory;
