import { Module } from '@nestjs/common';
import BlizzardController from 'controllers/v1/Blizzard';
import BlizzardService from 'services/v1/Blizzard';

@Module({
  controllers: [BlizzardController],
  providers: [BlizzardService],
})
export default class BlizzardModule {}
