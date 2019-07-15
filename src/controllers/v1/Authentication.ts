import { Request, Response, NextFunction } from 'express';
import { Controller, Get, Req, Res, Next } from '@nestjs/common';
import AuthService from 'services/v1/Auth';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('/')
  private async auth(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.authService.auth(req, res, next);
  }

  @Get('/callback')
  private async callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.authService.authCallback(req, res, next);
  }

  @Get('/logout')
  private async logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req, res);
  }

  @Get('/me')
  private async me(@Req() req: Request, @Res() res: Response) {
    this.authService.me(req, res);
  }
}
