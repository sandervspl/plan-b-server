import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RecruitmentController from 'controllers/v1/Recruitment';
import RecruitmentService from 'services/v1/Recruitment';
import { ApplicationMessage, ApplicationUuid, ApplicationVote, User } from 'entities';

@Module({
  imports: [TypeOrmModule.forFeature([
    ApplicationMessage,
    ApplicationUuid,
    ApplicationVote,
    User,
  ])],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export default class RecruitmentModule {}
