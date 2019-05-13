import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import cors from 'cors';
// import refresh from 'passport-oauth2-refresh';
import DiscordStrategy from 'passport-discord';
import passport from 'passport';
import session from 'express-session';
import secretConfig from 'config/secret';
import apiConfig from 'config/apiconfig';
import discordConfig from 'config/discord';

import ApplicationModule from 'modules/v1/Api';

const discordStrategy = new DiscordStrategy(
  {
    clientID: secretConfig.discord.publicKey,
    clientSecret: secretConfig.discord.privateKey,
    callbackURL: discordConfig.callbackUrl,
    scope: discordConfig.scopes,
  },
  (accessToken, refreshToken, user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  }
);

// Save user to session
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// oauth helper
passport.use(discordStrategy);

/** @todo Refresh oauth token */
// refresh.use(discordStrategy);

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  // Enable CORS
  app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      const sameServer = !origin;

      if (sameServer || apiConfig.CORSWhitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));

  // Block the header from containing information about the server
  app.disable('x-powered-by');

  const YEAR_IN_MS = 3.154e10;

  app.use(session({
    secret: secretConfig.sessionSecret,
    name: 'plan-b-auth',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: YEAR_IN_MS,
      secure: false,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(apiConfig.port, () => {
    const db = secretConfig.databaseInfo;
    console.info(`API server started on ${db.host}:${apiConfig.port}`);
  });
}

bootstrap();
