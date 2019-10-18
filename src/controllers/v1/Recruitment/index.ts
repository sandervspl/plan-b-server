import * as i from 'types';
import { Controller, Get, Post, Put, UseGuards, Param, Body, Query } from '@nestjs/common';
import RecruitmentService from 'services/v1/Recruitment';
import { AdminGuard } from 'guards/auth';
import {
  ApplicationsParam, SingleApplicationParam, ApplicationMessagesParam, ApplicationMessagesQuery,
} from './types';

@Controller('recruitment')
export default class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
  ) {}

  @Get('/applications/:status')
  @UseGuards(AdminGuard)
  private async applications(@Param() param: ApplicationsParam) {
    return this.recruitmentService.applications(param.status);
  }

  @Post('/application')
  private async addApplication(@Body() body: i.AddApplicationRequestBody) {
    return this.recruitmentService.addApplication(body);
  }

  @Get('/application/:uuid')
  @UseGuards(AdminGuard)
  private async singleApplication(@Param() param: SingleApplicationParam) {
    return this.recruitmentService.singleApplication(param.uuid);
  }

  // @TODO test if possible to see officer messages without Auth
  @Get('/application/:uuid/comments')
  private async getComments(
    @Param() param: ApplicationMessagesParam, @Query() query: ApplicationMessagesQuery
  ) {
    return this.recruitmentService.getComments(param.uuid, query.type);
  }

  @Post('/application/:uuid/comment')
  @UseGuards(AdminGuard)
  private async addApplicationComment(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationCommentBody
  ) {
    return this.recruitmentService.addComment(param.uuid, body);
  }

  @Post('/application/:uuid/vote')
  @UseGuards(AdminGuard)
  private async addApplicationVote(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationVoteBody
  ) {
    return this.recruitmentService.addApplicationVote(param.uuid, body);
  }

  @Put('/application/:uuid/status')
  @UseGuards(AdminGuard)
  private async updateApplicationStatus(
    @Param() param: SingleApplicationParam, @Body() body: i.UpdateApplicationStatusBody
  ) {
    return this.recruitmentService.updateApplicationStatus(param.uuid, body);
  }
}
