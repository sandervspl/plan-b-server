import { Module } from '@nestjs/common';
import BlizzardModule from 'modules/v1/Blizzard';
import AuthModule from 'modules/v1/Auth';
import CmsModule from 'modules/v1/Cms';
import UserModule from 'modules/v1/User';
import TwitchModule from './Twitch';

@Module({
  imports: [
    BlizzardModule,
    AuthModule,
    CmsModule,
    UserModule,
    TwitchModule,
  ],
})
export default class ApplicationModule {}
