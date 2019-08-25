/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['applicationId', 'uuid'])
class ApplicationUuid {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id!: number;

  @Column({
    type: 'int',
  })
  applicationId!: number;

  @Column({
    type: 'varchar',
  })
  uuid!: string;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;
}

export default ApplicationUuid;
