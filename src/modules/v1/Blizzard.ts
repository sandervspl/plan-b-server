import { Module } from '@nestjs/common';
import BlizzardController from 'controllers/v1/Blizzard';
import CharacterController from 'controllers/v1/Character';
import BlizzardService from 'services/v1/Blizzard';
import CharacterService from 'services/v1/Character';

@Module({
  controllers: [BlizzardController, CharacterController],
  providers: [BlizzardService, CharacterService],
})
export default class BlizzardModule {}
