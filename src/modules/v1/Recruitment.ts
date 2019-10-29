import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import RecruitmentController from 'controllers/v1/Recruitment';
import RecruitmentService from 'services/v1/Recruitment';
import * as entities from 'entities';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      entities.ApplicationMessage,
      entities.ApplicationUuid,
      entities.ApplicationVote,
      entities.User,
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export default class RecruitmentModule {}
