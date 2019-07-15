/* tslint:disable member-access */
import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column } from 'typeorm';

@Entity()
class User {
  // Discord ID
  @PrimaryColumn({
    type: 'varchar',
  })
  id!: string;

  @Column({
    type: 'integer',
  })
  dkp!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default User;
