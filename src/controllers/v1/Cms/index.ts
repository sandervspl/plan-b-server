import * as i from 'types';
import { Controller, Get, Param, UseGuards, Post, Body, Put } from '@nestjs/common';
import CmsService from 'services/v1/Cms';
import { AdminGuard } from 'guards/auth';
import { NewsItemParam, ApplicationsParam, SingleApplicationParam } from './types';

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

  @Get('/application/:id')
  @UseGuards(AdminGuard)
  private async singleApplication(@Param() param: SingleApplicationParam) {
    return this.cmsService.singleApplication(param.id);
  }

  @Post('/application/')
  @UseGuards()
  private async addApplication(@Body() body: i.AddApplicationRequestBody) {
    return this.cmsService.addApplication(body);
  }

  @Post('/application/:id/comment')
  @UseGuards(AdminGuard)
  private async addApplicationComment(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationCommentBody
  ) {
    return this.cmsService.addApplicationComment(param.id, body);
  }

  @Post('/application/:id/vote')
  @UseGuards(AdminGuard)
  private async addApplicationVote(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationVoteBody
  ) {
    return this.cmsService.addApplicationVote(param.id, body);
  }

  @Put('/application/:id/status')
  @UseGuards(AdminGuard)
  private async updateApplicationStatus(
    @Param() param: SingleApplicationParam, @Body() body: i.UpdateApplicationStatusBody
  ) {
    return this.cmsService.updateApplicationStatus(param.id, body);
  }
}
