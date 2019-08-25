import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from 'entities';
import DkpService from 'services/v1/Dkp';
import DkpController from 'controllers/v1/Dkp';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      entities.DkpHistory,
      entities.Character,
    ]),
  ],
  controllers: [DkpController],
  providers: [DkpService],
})
export default class DkpModule {}
