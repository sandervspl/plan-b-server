import * as i from 'types';
import { Request } from 'express';
import { Controller, Patch, Body, Post, Req, Get } from '@nestjs/common';
import UserService from 'services/v1/User';

@Controller('user')
export default class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Patch('/character')
  private async linkCharacterToUser(@Body() body: i.LinkCharacterToUserBody, @Req() req: Request) {
    return this.userService.linkCharacterToUser(body, req.user);
  }

  @Post('/character')
  private async createCharacter(@Body() body: i.CreateCharacterBody) {
    return this.userService.createCharacter(body);
  }

  @Get('/character')
  private async singleCharacter(@Req() req: Request) {
    return this.userService.singleCharacter(req.user);
  }
}
