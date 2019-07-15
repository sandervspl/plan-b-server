import { Module } from '@nestjs/common';
import BlizzardModule from 'modules/v1/Blizzard';
import AuthModule from 'modules/v1/Auth';
import CmsModule from 'modules/v1/Cms';
import UserModule from 'modules/v1/User';

@Module({
  imports: [
    BlizzardModule,
    AuthModule,
    CmsModule,
    UserModule,
  ],
})
export default class ApplicationModule {}
