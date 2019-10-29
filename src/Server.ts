import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DiscordStrategy from 'passport-discord';
import refresh from 'passport-oauth2-refresh';
import passport from 'passport';
import session, { SessionOptions } from 'express-session';
import mysqlSession from 'express-mysql-session';
import secretConfig from 'config/secret';
import apiConfig from 'config/apiconfig';
import discordConfig from 'config/discord';
import ApplicationModule from 'modules/v1/Api';

const isProd = process.env.NODE_ENV === 'production';

const discordStrategy = new DiscordStrategy(
  {
    clientID: secretConfig.discord.publicKey,
    clientSecret: secretConfig.discord.privateKey,
    callbackURL: discordConfig.callbackUrl,
    scope: discordConfig.scopes,
  },
  (accessToken, refreshToken, user, done) => {
    // @ts-ignore
    user.refreshToken = refreshToken;

    refresh.requestNewAccessToken('discord', refreshToken, undefined, done);

    process.nextTick(() => {
      return done(null, user);
    });
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(discordStrategy);
refresh.use(discordStrategy);

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  if (isProd) {
    app.set('trust proxy', 1); // Trust first proxy
    app.disable('x-powered-by'); // Hide information about the server
  }

  app.use(cookieParser());

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

  // @ts-ignore this works
  const MysqlStore = mysqlSession(session);

  const sessionCfg: SessionOptions = {
    secret: secretConfig.sessionSecret,
    name: 'plan-b-auth',
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      secure: isProd,
    },
    store: new MysqlStore(secretConfig.databaseInfo),
  };

  app.use(session(sessionCfg));
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(apiConfig.port, () => {
    console.info(
      `[${process.env.NODE_ENV} / ${process.env.APP_ENV}] Server started on port ${apiConfig.port}`
    );
  });
}

bootstrap();
