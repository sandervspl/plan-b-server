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
    const fn = passport.authenticate(
      'discord',
      { failureRedirect: 'http://dev.planbguild.eu/login/error' },
      (err, user) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedException());

        // Save user to session under "req.user"
        req.login(user, (err) => {
          if (err) {
            res.redirect(500, 'http://dev.planbguild.eu/login/error');
          } else {
            res.redirect('http://dev.planbguild.eu');
          }
        });
      },
    );

    fn(req, res, next);
  }

  @Get('/auth/me')
  private async test(@Req() req: Request, @Res() res: Response) {
    return res.json(req.user);
  }
}
