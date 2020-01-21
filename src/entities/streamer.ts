/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
class Streamer {
  @PrimaryColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  twitch_name!: string;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  enabled!: boolean;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default Streamer;
