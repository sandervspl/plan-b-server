import { Controller, Get, Query } from '@nestjs/common';
import TwitchService from 'services/v1/Twitch';

@Controller('twitch')
export default class TwitchController {
  constructor(
    private readonly twitchService: TwitchService,
  ) {}

  @Get('/active_streams')
  private async activeStreamers() {
    return this.twitchService.activeStreamers();
  }

  @Get('/stream_changed/callback')
  private async streamChanged(@Query() query: StreamChangeResponse) {
    return query['hub.challenge'];
  }
}

type StreamChangeResponse = {
  'hub.challenge': string;
  'hub.lease_seconds': string;
  'hub.mode': string;
  'hub.topic': string;
}
