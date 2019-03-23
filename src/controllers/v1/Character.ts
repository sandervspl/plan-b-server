import { Controller, Get, Param } from '@nestjs/common';
import CharacterService from 'services/v1/Character';
import BlizzardService from 'services/v1/Blizzard';

@Controller('blizzard/character')
export default class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly blizzardService: BlizzardService,
  ) {}

  @Get('/:name')
  private async single(@Param('name') name: string) {
    const token = await this.blizzardService.getAccessToken();

    return this.characterService.single(name, token);
  }
}
