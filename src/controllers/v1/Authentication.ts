import { Request, Response, NextFunction } from 'express';
import { Controller, Get, Req, Res, Next } from '@nestjs/common';
import DiscordService from 'services/v1/Discord';

@Controller('discord')
export default class AuthController {
  constructor(
    private readonly discordService: DiscordService
  ) {}

  @Get('/auth')
  private async auth(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.discordService.auth(req, res, next);
  }

  @Get('/auth/callback')
  private async callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.discordService.authCallback(req, res, next);
  }

  @Get('/auth/me')
  private async me(@Req() req: Request, @Res() res: Response) {
    this.discordService.me(req, res);
  }
}
