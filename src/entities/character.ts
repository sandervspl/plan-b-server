import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { DkpHistory } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
@Unique(['name'])
class Character {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'varchar',
    length: 12,
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
