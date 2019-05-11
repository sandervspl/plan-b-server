import 'reflect-metadata';
import cors from 'cors';
import refresh from 'passport-oauth2-refresh';
import DiscordStrategy from 'passport-discord';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import apiConfig from 'config/apiconfig';
import secret from 'config/secret';

import { NestFactory } from '@nestjs/core';
import ApplicationModule from 'modules/v1/Api';
import discordConfig from 'config/discord';

const discordStrategy = new DiscordStrategy(
  {
    clientID: discordConfig.publicKey,
    clientSecret: discordConfig.privateKey,
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

  const whitelist = [
    'http://localhost:3000',
    'http://dev.planbguild.eu',
  ];

  // Enable CORS
  app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      const sameServer = !origin;

      if (sameServer || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));

  // Block the header from containing information about the server
  app.disable('x-powered-by');

  app.use(session({
    secret: secret.sessionSecret,
    name: 'plan-b-auth',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000,
      secure: false,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(apiConfig.port, () => {
    const db = secret.databaseInfo;
    console.info(`API server started on ${db.host}:${apiConfig.port}`);
  });
}

bootstrap();
