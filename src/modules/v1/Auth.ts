import { Module } from '@nestjs/common';
import AuthController from 'controllers/v1/Authentication';
import DiscordService from 'services/v1/Discord';

@Module({
  controllers: [AuthController],
  providers: [DiscordService],
})
export default class AuthModule {}
