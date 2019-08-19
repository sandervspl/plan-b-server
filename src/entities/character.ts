import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
class Character {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  dkp!: number;
}

export default Character;
