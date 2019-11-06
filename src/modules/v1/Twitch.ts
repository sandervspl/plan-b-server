import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TwitchController from 'controllers/v1/Twitch';
import TwitchService from 'services/v1/Twitch';
import * as entities from 'entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      entities.Streamer,
    ]),
  ],
  controllers: [TwitchController],
  providers: [TwitchService],
})
export default class TwitchModule {}
