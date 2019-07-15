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

@Injectable()
export default class DiscordService {
  private discordClient: Discord.Client;
  private guild?: Discord.Guild;

  constructor() {
    this.discordClient = new Discord.Client();
    this.discordClient.login(secretConfig.discord.botToken);

    this.discordClient.on('ready', () => {
      console.info('Discord bot activated.');

      this.guild = this.discordClient.guilds.get(secretConfig.discord.planBServerId);
    });
  }

  public auth: ExpressParamsFn = (req, res, next) => {
    const fn = passport.authenticate(
      'discord',
      {
        scope: discordConfig.scopes,
        failureRedirect: this.failRedirect(),
      }
    );

    fn(req, res, next);
  }

  public authCallback: ExpressParamsFn = (req, res, next) => {
    const { websiteDomain } = apiConfig;

    const fn = passport.authenticate(
      'discord',
      { failureRedirect: this.failRedirect('discord') },
      (err, user?: i.UserData) => {
        if (err) {
          return next(err);
        }

        // Only guild members are allowed to sign in
        if (!user || !this.getGuildMember(user.id)) {
          return res
            .status(RESPONSE_CODE.UNAUTHORIZED)
            .redirect(this.failRedirect('auth'));
        }

        // Save user to session under "req.user"
        req.login(user, (err) => {
          if (err) {
            res
              .status(RESPONSE_CODE.INTERNAL_SERVER_ERR)
              .redirect(this.failRedirect('server'));
          } else {
            res.redirect(websiteDomain);
          }
        });
      },
    );

    fn(req, res, next);
  }

  public logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect(apiConfig.websiteDomain);
  }

  public me = (req: Request, res: Response) => {
    const user = req.user as i.AugmentedUser | undefined;

    if (!user) {
      // @TODO this throws frontend in an infinite /me request loop
      // return res
      //   .status(RESPONSE_CODE.UNAUTHORIZED)
      //   .redirect(this.failRedirect('auth'));

      throw new UnauthorizedException();
    }

    const guildMember = this.getGuildMember(user.id);

    // Only guild members are allowed to sign in
    if (!guildMember) {
      return res
        .status(RESPONSE_CODE.UNAUTHORIZED)
        .redirect(this.failRedirect('auth'));
    }

    // Set auth level for this session's user
    this.setAuthLevel(req, user.id);

    const publicUser = this.getPublicUser(user);

    // Get display name from Discord channel
    publicUser.discordname = publicUser.username;
    publicUser.username = guildMember.displayName;

    // Set auth level for rendering specific parts of the UI
    publicUser.authLevel = this.getAuthLevel(user.id);

    // Overwrite avatar hash with a generated avatar url
    publicUser.avatar = this.getAvatar(user.id, user.avatar);

    return res.json(publicUser);
  }


  private getGuildMember = (memberId: string): Discord.GuildMember | undefined => {
    return this.guild && this.guild.members.get(memberId);
  }

  private getPublicUser = (user: i.AugmentedUser) => {
    type SafeDataKeys = keyof i.AugmentedUser;

    const safeData: SafeDataKeys[] = [
      'username',
      'discordname',
      'avatar',
      'id',
      'authLevel',
    ];

    return _.pick(user, safeData);
  }

  private userIsAdmin = (memberId: string): boolean => {
    const user = this.getGuildMember(memberId);

    // Check if user has a role that acts as an admin
    if (discordConfig.adminIds.find((roleId) => !!user && !!user.roles.get(roleId))) {
      return true;
    }

    // Check is user is owner of the Discord channel
    if (this.guild && this.guild.ownerID === memberId) {
      return true;
    }

    return false;
  }

  private getAuthLevel = (memberId: string): i.AUTH_LEVEL => {
    if (this.userIsAdmin(memberId)) {
      return i.AUTH_LEVEL.ADMIN;
    }

    return i.AUTH_LEVEL.USER;
  }

  private setAuthLevel = (req: Request, userId: string) => {
    // @TODO store in db
    if (req.session) {
      req.session.authLevel = this.getAuthLevel(userId);
    }
  }

  private getAvatar = (userId: string, avatarHash?: string): string => {
    if (!avatarHash) {
      return '';
    }

    const START = 0, END = 2;
    const isGif = avatarHash.substr(START, END) === '_a';
    const imgExtension = isGif ? 'gif' : 'png';

    return `${apiConfig.discordCdnUrl}/avatars/${userId}/${avatarHash}.${imgExtension}`;
  }

  private failRedirect = (reason?: string): string => {
    if (reason) {
      return `${apiConfig.websiteDomain}/login?err=${reason}`;
    }

    return `${apiConfig.websiteDomain}/login`;
  }
}
