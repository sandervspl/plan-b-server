import { Controller, Get, Param } from '@nestjs/common';
import BlizzardService from 'services/v1/Blizzard';

@Controller('blizzard')
export default class BlizzardController {
  constructor(
    private readonly blizzardService: BlizzardService
  ) {}

  @Get('/auth')
  private async auth() {
    return this.blizzardService.auth();
  }

  @Get('/character/:name')
  private async singleCharacter(@Param('name') name: string) {
    await this.blizzardService.getAccessToken();

    return this.blizzardService.singleCharacter(name);
  }
}
