import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import ormconfig from 'config/ormconfig';
import * as entities from 'entities';
import BlizzardModule from 'modules/v1/Blizzard';
import AuthModule from 'modules/v1/Auth';
import CmsModule from 'modules/v1/Cms';
import UserModule from 'modules/v1/User';
import TwitchModule from './Twitch';
import RecruitmentModule from './Recruitment';
import DkpModule from './Dkp';
import Serializer from './Serializer';

@Module({
  imports: [
    PassportModule.register({
      // defaultStrategy: 'discord',
      session: true,
    }),
    TypeOrmModule.forRoot({
      ...ormconfig,
      entities: Object.values(entities),
    }),
    BlizzardModule,
    AuthModule,
    CmsModule,
    UserModule,
    TwitchModule,
    RecruitmentModule,
    DkpModule,
  ],
  providers: [
    Serializer,
  ],
})
export default class ApplicationModule {}
