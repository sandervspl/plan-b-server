import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
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
}

export default Character;
