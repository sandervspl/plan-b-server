import { Module } from '@nestjs/common';
import RecruitmentController from 'controllers/v1/Recruitment';
import RecruitmentService from 'services/v1/Recruitment';

@Module({
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export default class RecruitmentModule {}
