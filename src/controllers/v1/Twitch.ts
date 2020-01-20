import * as i from 'types';
import { Controller, Get, Query, Body, Post } from '@nestjs/common';
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

  @Post('/stream_changed')
  private async streamChanged(@Body() body: i.StreamChangeBody) {
    console.log('POST /stream_changed');
    console.log(body);

    return this.twitchService.streamChanged(body);
  }

  @Get('/stream_changed')
  private async streamChangedVerify(@Query() query: i.StreamChangeResponse) {
    return query['hub.challenge'];
  }
}
