import DiscordStrategy from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import secretConfig from 'config/secret';
import discordConfig from 'config/discord';

@Injectable()
export class LocalStrategy extends PassportStrategy(DiscordStrategy) {
  constructor() {
    super(
      {
        clientID: secretConfig.discord.publicKey,
        clientSecret: secretConfig.discord.privateKey,
        callbackURL: discordConfig.callbackUrl,
        scope: discordConfig.scopes,
      },
      (accessToken, refreshToken, user, done) => {
        // @ts-ignore
        user.refreshToken = refreshToken;

        process.nextTick(() => {
          return done(null, user);
        });
      });
  }
}
