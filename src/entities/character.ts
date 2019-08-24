import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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
}

export default Character;
