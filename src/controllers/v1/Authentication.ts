import { Request, Response, NextFunction } from 'express';
import { Controller, Get, Req, Res, Next } from '@nestjs/common';
import AuthService from 'services/v1/Auth';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  /** Start the authentication process with Discord */
  @Get('/')
  private async auth(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.authService.auth(req, res, next);
  }

  /** Callback URL from Discord after user logs in on Discord */
  @Get('/callback')
  private async callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    this.authService.authCallback(req, res, next);
  }

  /** Log out user by removing them from the session */
  @Get('/logout')
  private async logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(req, res);
  }

  /** Return user data from requesting user */
  @Get('/me')
  private async me(@Req() req: Request, @Res() res: Response) {
    if (!req.user || !req.session || !req.session.passport) {
      return res.json({});
    }

    await this.authService.me(req, res);
  }
}
