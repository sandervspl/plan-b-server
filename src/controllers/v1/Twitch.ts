import { Controller, Get } from '@nestjs/common';
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
}
