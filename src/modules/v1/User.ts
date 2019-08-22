import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from 'entities';
import UserService from 'services/v1/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      entities.User,
    ]),
  ],
  controllers: [],
  providers: [UserService],
})
export default class UserModule {}
