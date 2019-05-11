import { Module } from '@nestjs/common';
import BlizzardModule from 'modules/v1/Blizzard';
import AuthModule from 'modules/v1/Auth';

@Module({
  imports: [
    BlizzardModule,
    AuthModule,
  ],
})
export default class ApplicationModule {}
