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
import UserService from 'services/v1/User';
import discordBot from 'bot/Discord';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExpressParamsFn = (req: Request, res: Response, next: NextFunction) => any;

@Injectable()
export default class AuthService {
  private guild?: Discord.Guild;

  constructor(
    private readonly userService: UserService,
  ) {
    discordBot.client.on('ready', () => {
      console.log('Discord bot client ready in AuthService.');

      this.guild = discordBot.client.guilds.get(secretConfig.discord.planBServerId);

      console.log('guild:', !!this.guild);
    });
  }

  public auth: ExpressParamsFn = (req, res, next) => {
    if (!this.guild) {
      console.log('Server had no guild registered, trying again.');

      this.guild = discordBot.client.guilds.get(secretConfig.discord.planBServerId);

      console.log('guild:', !!this.guild);
    }

    const fn = passport.authenticate('discord', {
      scope: discordConfig.scopes,
      failureRedirect: this.failRedirect(),
    });

    fn(req, res, next);
  }

  public authCallback: ExpressParamsFn = (req, res, next) => {
    const { websiteDomain } = apiConfig;

    const fn = passport.authenticate(
      'discord',
      { failureRedirect: this.failRedirect('discord') },
      (err, user?: i.UserData) => {
        if (err) {
          console.error('AUTH:', 'Passport auth error.', err);
          return next(err);
        }

        // Only guild members are allowed to sign in
        if (!user || !this.getGuildMember(user.id)) {
          console.error('AUTH:', 'No user found or user is not part of the guild');
          console.error('user:', user);

          return res
            .status(RESPONSE_CODE.UNAUTHORIZED)
            .redirect(this.failRedirect('auth'));
        }

        // Save user to session under "req.user"
        req.login(user, async (err) => {
          if (err) {
            console.error('AUTH:', 'request login error.', err);

            res
              .status(RESPONSE_CODE.INTERNAL_SERVER_ERR)
              .redirect(this.failRedirect('server'));
          } else {
            try {
              // Upsert user
              await this.userService.create({
                id: user.id,
                username: this.getGuildMember(user.id)!.displayName,
                avatar: this.getAvatar(user.id, user.avatar),
                authLevel: this.getAuthLevel(user.id),
              });

              // Save refresh token in session
              req.user.refreshToken = user.refreshToken;

              // Redirect to website
              res.redirect(websiteDomain);
            } catch (err) {
              console.error('AUTH:', 'User update error.', err);

              return res
                .status(RESPONSE_CODE.INTERNAL_SERVER_ERR)
                .redirect(this.failRedirect('server'));
            }
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

  public me = async (req: Request, res: Response) => {
    const user = req.user as i.AugmentedUser | undefined;

    if (!user) {
      console.error('No user found');

      throw new UnauthorizedException();
    }

    const dbUser = await this.userService.single(user.id);
    const guildMember = this.getGuildMember(user.id);

    // Only guild members are allowed to sign in
    if (!guildMember) {
      console.error('No guild member found for user');

      return res
        .status(RESPONSE_CODE.UNAUTHORIZED)
        .redirect(this.failRedirect('auth'));
    }

    // Set auth level for this session's user
    if (!dbUser) {
      this.setAuthLevel(req, user.id);
    } {
      req.user.authLevel = dbUser.authLevel;
    }

    const publicUser = this.getPublicUser(user);

    const body: i.MeResponse = {
      id: publicUser.id,

      // Get display name from Discord channel
      discordname: publicUser.username,
      username: guildMember.displayName,

      // Set auth level for rendering specific parts of the UI
      authLevel: dbUser ? dbUser.authLevel : this.getAuthLevel(user.id),

      // Overwrite avatar hash with a generated avatar url
      avatar: this.getAvatar(user.id, user.avatar),

      dkp: dbUser.character ? dbUser.character.dkp : 0,
    };

    return res.json(body);
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


  private userIsGuildMaster = (memberId: string): boolean => {
    const user = this.getGuildMember(memberId);

    return !!user && !!user.roles.get(discordConfig.guildLeaderId);
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
    if (this.userIsGuildMaster(memberId)) {
      return i.AUTH_LEVEL.GUILD_MASTER;
    }

    if (this.userIsAdmin(memberId)) {
      return i.AUTH_LEVEL.OFFICER;
    }

    return i.AUTH_LEVEL.USER;
  }

  private setAuthLevel = (req: Request, userId: string) => {
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
