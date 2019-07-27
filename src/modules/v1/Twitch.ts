import { Module } from '@nestjs/common';
import TwitchController from 'controllers/v1/Twitch';
import TwitchService from 'services/v1/Twitch';

@Module({
  controllers: [TwitchController],
  providers: [TwitchService],
})
export default class TwitchModule {}
