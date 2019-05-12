import { Request, Response, NextFunction } from 'express';
import { Controller, Get, Req, Res, Next, UnauthorizedException } from '@nestjs/common';
import passport from 'passport';
import discordConfig from 'config/discord';

@Controller('discord')
export default class AuthController {
  @Get('/auth')
  private async auth(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const fn = passport.authenticate('discord', { scope: discordConfig.scopes });

    fn(req, res, next);
  }

  @Get('/auth/callback')
  private async callback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const env = process.env.NODE_ENV || 'development';
    const host = env === 'development'
      ? 'http://localhost:3000'
      : 'http://dev.planbguild.eu';

    const fn = passport.authenticate(
      'discord',
      { failureRedirect: `${host}/login/error` },
      (err, user) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedException());

        // Save user to session under "req.user"
        req.login(user, (err) => {
          if (err) {
            res.redirect(500, `${host}/login/error`);
          } else {
            res.redirect(`${host}/login?auth=true`);
          }
        });
      },
    );

    fn(req, res, next);
  }

  @Get('/auth/me')
  private async test(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return res.json(req.user);
  }
}
