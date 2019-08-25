import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TwitchController from 'controllers/v1/Twitch';
import TwitchService from 'services/v1/Twitch';
import { Streamer } from 'entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Streamer,
    ]),
  ],
  controllers: [TwitchController],
  providers: [TwitchService],
})
export default class TwitchModule {}
