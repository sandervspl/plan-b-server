import { Request } from 'express';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import CmsService from 'services/v1/Cms';
import { AdminGuard } from 'guards/auth';
import { NewsItemParam, ApplicationsParam } from './types';

@Controller('cms')
export default class CmsController {
  constructor(
    private readonly cmsService: CmsService
  ) {}

  @Get('/homepage')
  private async homepage() {
    return this.cmsService.page('homepages/1');
  }

  @Get('/aboutpage')
  private async aboutpage() {
    return this.cmsService.page('aboutpages/1');
  }

  @Get('/loginpage')
  private async loginpage() {
    return this.cmsService.page('loginpages/1');
  }

  @Get('/recruitment')
  private async recruitment() {
    return this.cmsService.page('recruitments/1');
  }

  @Get('/news')
  private async news() {
    return this.cmsService.page('posts');
  }

  @Get('/news/:id')
  private async newsItems(@Param() param: NewsItemParam) {
    return this.cmsService.newsDetail(param.id);
  }

  @Get('/applications/:status')
  @UseGuards(AdminGuard)
  private async applications(@Param() param: ApplicationsParam) {
    return this.cmsService.applications(param.status);
  }
}
