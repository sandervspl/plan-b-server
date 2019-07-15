import { Module } from '@nestjs/common';
import UserService from 'services/v1/User';

@Module({
  controllers: [],
  providers: [UserService],
})
export default class UserModule {}
