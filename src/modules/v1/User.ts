import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from 'entities';
import UserController from 'controllers/v1/User';
import UserService from 'services/v1/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      entities.User,
      entities.Character,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
