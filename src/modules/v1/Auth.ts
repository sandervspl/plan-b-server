import { Module } from '@nestjs/common';
import AuthController from 'controllers/v1/Authentication';

@Module({
  controllers: [AuthController],
})
export default class AuthModule {}
