import * as i from 'types';
import {
  Controller, Get, Post, Put, UseGuards, Param, Body, Query, Req, UnauthorizedException, Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard())
  @Get('/applications/:status')
  private async applications(@Req() req: Request, @Param() param: ApplicationsParam) {
    console.log('controller', req.isAuthenticated());
    return this.recruitmentService.applications(param.status);
  }

  @Post('/application')
  private async addApplication(@Body() body: i.AddApplicationRequestBody) {
    return this.recruitmentService.addApplication(body);
  }

  @Get('/application/:uuid')
  private async singleApplication(@Param() param: SingleApplicationParam) {
    return this.recruitmentService.singleApplication(param.uuid);
  }

  @Get('/application/:uuid/comments')
  private async getComments(
    @Req() req: Request,
    @Param() param: ApplicationMessagesParam,
    @Query() query: ApplicationMessagesQuery
  ) {
    if (query.type === 'private' && req.isUnauthenticated()) {
      throw new UnauthorizedException();
    }

    return this.recruitmentService.getComments(param.uuid, query.type);
  }

  @UseGuards(UserGuard)
  @Post('/application/:uuid/comment')
  private async addApplicationComment(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationCommentBody
  ) {
    return this.recruitmentService.addComment(param.uuid, body);
  }

  @UseGuards(UserGuard)
  @Delete('/application/comment/:id')
  private async deleteApplicationComment(@Param() param: DeleteCommentParam) {
    return this.recruitmentService.deleteComment(param.id);
  }

  @UseGuards(AdminGuard)
  @Post('/application/:uuid/vote')
  private async addApplicationVote(
    @Param() param: SingleApplicationParam, @Body() body: i.AddApplicationVoteBody
  ) {
    return this.recruitmentService.addApplicationVote(param.uuid, body);
  }

  @UseGuards(AdminGuard)
  @Put('/application/:uuid/status')
  private async updateApplicationStatus(
    @Param() param: SingleApplicationParam, @Body() body: i.UpdateApplicationStatusBody
  ) {
    return this.recruitmentService.updateApplicationStatus(param.uuid, body);
  }
}
