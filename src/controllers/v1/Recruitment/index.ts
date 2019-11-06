import * as i from 'types';
import {
  Controller, Get, Post, Put, UseGuards, Param, Body, Query, Req, UnauthorizedException, Delete,
} from '@nestjs/common';
import { Request } from 'express';
import RecruitmentService from 'services/v1/Recruitment';
import { UserGuard, AdminGuard } from 'guards';
import {
  ApplicationsParam, SingleApplicationParam, ApplicationMessagesParam, ApplicationMessagesQuery,
  DeleteCommentParam,
} from './types';

@Controller('recruitment')
export default class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
  ) {}

  @Get('/applications/:status')
  @UseGuards(UserGuard)
  private async applications(
    @Param() param: ApplicationsParam,
    @Query() query: i.PaginationQueries
  ) {
    return this.recruitmentService.applications(param.status, query);
  }

  @Post('/application')
  private async addApplication(@Body() body: i.AddApplicationRequestBody) {
    return this.recruitmentService.addApplication(body);
  }

  @Get('/application/:uuid')
  private async singleApplication(@Param() param: SingleApplicationParam) {
    return this.recruitmentService.singleApplication(param.uuid);
  }

  // @TODO test if possible to see officer messages without Auth
  @Get('/application/:uuid/comments')
  private async getComments(
    @Req() req: Request,
    @Param() param: ApplicationMessagesParam,
    @Query() query: ApplicationMessagesQuery
  ) {
    if (query.type === 'private' && req.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    return this.recruitmentService.getComments(param.uuid, query.type);
  }

  @Post('/application/:uuid/comment')
  @UseGuards(UserGuard)
  private async addApplicationComment(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationCommentBody
  ) {
    return this.recruitmentService.addComment(param.uuid, body);
  }

  @Delete('/application/comment/:id')
  @UseGuards(UserGuard)
  private async deleteApplicationComment(@Param() param: DeleteCommentParam) {
    return this.recruitmentService.deleteComment(param.id);
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
