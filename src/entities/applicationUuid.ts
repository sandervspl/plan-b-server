/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
}

export default ApplicationUuid;
