import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import ormconfig from 'config/ormconfig';
import * as entities from 'entities';
import BlizzardModule from 'modules/v1/Blizzard';
import AuthModule from 'modules/v1/Auth';
import CmsModule from 'modules/v1/Cms';
import UserModule from 'modules/v1/User';
import TwitchModule from './Twitch';
import RecruitmentModule from './Recruitment';
import DkpModule from './Dkp';

@Module({
  imports: [
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
})
export default class ApplicationModule {
  constructor(
    private readonly connection: Connection
  ) {}
}
