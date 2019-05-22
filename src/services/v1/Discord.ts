import * as i from 'types';
import { Request, Response, NextFunction } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import passport from 'passport';
import Discord from 'discord.js';
import _ from 'lodash';
import { RESPONSE_CODE } from 'helpers';
import discordConfig from 'config/discord';
import apiConfig from 'config/apiconfig';
import secretConfig from 'config/secret';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpressParamsFn = (req: Request, res: Response, next: NextFunction) => any;

enum AUTH_LEVEL {
  USER,
  ADMIN,
}

@Injectable()
export default class DiscordService {
  private discordClient: Discord.Client;
  private guild: Discord.Guild;

  constructor() {
    this.discordClient = new Discord.Client();
    this.discordClient.login(secretConfig.discord.botToken);

    this.discordClient.on('ready', () => {
      // eslint-disable-next-line
      console.log('Discord bot activated.');

      this.guild = this.discordClient.guilds.get(secretConfig.discord.planBServerId);
    });
  }

  public auth: ExpressParamsFn = (req, res, next) => {
    const fn = passport.authenticate('discord', { scope: discordConfig.scopes });

    fn(req, res, next);
  }

  public authCallback: ExpressParamsFn = (req, res, next) => {
    const { websiteDomain } = apiConfig;

    const fn = passport.authenticate(
      'discord',
      { failureRedirect: `${websiteDomain}/login/error` },
      (err, user: i.UserData) => {
        if (err) return next(err);
        if (!user) return next(new UnauthorizedException());

        // Save user to session under "req.user"
        req.login(user, (err) => {
          if (err) {
            res.redirect(RESPONSE_CODE.INTERNAL_SERVER_ERR, `${websiteDomain}/login/error`);
          } else {
            res.redirect(`${websiteDomain}`);
          }
        });
      },
    );

    fn(req, res, next);
  }

  public me = (req: Request, res: Response) => {
    const user: i.AugmentedUser = req.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    // Set auth level for this session's user
    this.setAuthLevel(req, user.id);

    const publicUser = this.getPublicUser(user);

    // Set auth level for rendering specific parts of the UI
    publicUser.authLevel = this.getAuthLevel(user.id);

    // Overwrite avatar hash with a generated avatar url
    publicUser.avatar = this.getAvatar(user.id, user.avatar);

    // Get display name from Discord channel
    publicUser.username = this.getGuildMember(user.id).displayName;

    return res.json(publicUser);
  }


  private getGuildMember = (memberId: string): Discord.GuildMember => {
    return this.guild.members.get(memberId);
  }

  private getPublicUser = (user: i.AugmentedUser) => {
    const safeData = [
      'username',
      'avatar',
      'id',
      'fetchedAt',
      'authLevel',
    ];

    return _.pick(user, safeData);
  }

  private userIsAdmin = (memberId: string): boolean => {
    const user = this.getGuildMember(memberId);

    // Check if user has a role that acts as an admin
    if (discordConfig.adminIds.find((roleId) => !!user.roles.get(roleId))) {
      return true;
    }

    // Check is user is owner of the Discord channel
    if (this.guild.ownerID === memberId) {
      return true;
    }

    return false;
  }

  private getAuthLevel = (memberId: string) => {
    if (this.userIsAdmin(memberId)) {
      return AUTH_LEVEL.ADMIN;
    }

    return AUTH_LEVEL.USER;
  }

  private setAuthLevel = (req: Request, userId: string) => {
    req.session.authLevel = this.getAuthLevel(userId);
  }

  private getAvatar = (userId: string, avatarHash: string) => {
    const START = 0, END = 2;
    const isGif = avatarHash.substr(START, END) === '_a';
    const imgExtension = isGif ? 'gif' : 'png';

    return `${apiConfig.discordCdnUrl}/avatars/${userId}/${avatarHash}.${imgExtension}`;
  }
}
