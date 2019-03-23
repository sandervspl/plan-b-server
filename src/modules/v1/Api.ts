import { Module } from '@nestjs/common';
import BlizzardModule from 'modules/v1/Blizzard';

@Module({
  imports: [BlizzardModule],
})
export default class ApplicationModule {}
