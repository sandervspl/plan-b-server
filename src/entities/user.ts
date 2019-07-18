import { Entity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, Column, OneToMany } from 'typeorm';
import ApplicationMessage from './applicationMessage';

@Entity()
class User {
  // Discord ID
  @PrimaryColumn({
    type: 'varchar',
  })
  id!: string;

  @Column({
    type: 'varchar',
  })
  username!: string;

  @Column({
    type: 'varchar',
  })
  avatar!: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  authLevel!: number;

  @Column({
    type: 'integer',
    default: 0,
  })
  dkp!: number;

  @OneToMany((type) => ApplicationMessage, (message) => message.user)
  applicationMessages!: ApplicationMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default User;
