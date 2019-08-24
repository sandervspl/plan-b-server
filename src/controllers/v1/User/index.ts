import * as i from 'types';
import { Request } from 'express';
import { Controller, Patch, Body, Post, Req } from '@nestjs/common';
import UserService from 'services/v1/User';

@Controller('user')
export default class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Patch('/character')
  private async linkCharacterToUser(@Body() body: i.LinkCharacterToUserBody, @Req() req: Request) {
    return this.userService.linkCharacterToUser(body, req);
  }

  @Post('/character')
  private async createCharacter(@Body() body: i.CreateCharacterBody) {
    return this.userService.createCharacter(body);
  }
}
