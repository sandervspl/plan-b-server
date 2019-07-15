import { Module } from '@nestjs/common';
import AuthController from 'controllers/v1/Authentication';
import AuthService from 'services/v1/Auth';
import UserService from 'services/v1/User';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export default class AuthModule {}
