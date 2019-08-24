/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Streamer {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  twitch_name!: string;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  enabled!: boolean;
}

export default Streamer;
