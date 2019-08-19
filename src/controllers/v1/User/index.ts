import * as i from 'types';
import { Controller, Patch, Body } from '@nestjs/common';
import UserService from 'services/v1/User';

@Controller('user')
export default class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Patch('/character')
  private async linkCharacterToUser(@Body() body: i.LinkCharacterToUserBody) {
    return this.userService.linkCharacterToUser(body);
  }
}
