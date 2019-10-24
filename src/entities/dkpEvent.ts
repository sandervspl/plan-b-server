import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Unique,
} from 'typeorm';
import { DkpHistory } from 'entities';
/* eslint-disable @typescript-eslint/no-unused-vars */

@Entity()
@Unique(['time'])
class DkpEvent {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'varchar',
  })
  name!: string;

  @Column({
    type: 'varchar',
  })
  exporter!: string;

  @Column({
    type: 'varchar',
  })
  time!: string;

  @OneToMany((type) => DkpHistory, (dkpHistory) => dkpHistory.event)
  dkpHistory!: DkpHistory;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default DkpEvent;
