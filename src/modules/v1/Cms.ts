import { Module } from '@nestjs/common';
import CmsController from 'controllers/v1/Cms';
import CmsService from 'services/v1/Cms';

@Module({
  controllers: [CmsController],
  providers: [CmsService],
})
export default class CmsModule {}
