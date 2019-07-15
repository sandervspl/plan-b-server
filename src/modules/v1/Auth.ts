import { Module } from '@nestjs/common';
import AuthController from 'controllers/v1/Authentication';
import AuthService from 'services/v1/Auth';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export default class AuthModule {}
