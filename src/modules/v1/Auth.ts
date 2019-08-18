import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from 'entities';
import AuthController from 'controllers/v1/Authentication';
import AuthService from 'services/v1/Auth';
import UserService from 'services/v1/User';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      entities.User,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export default class AuthModule {}
