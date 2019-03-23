import 'reflect-metadata';
import cors from 'cors';
import Config from 'config/apiconfig';
import secret from 'config/secret';

import { NestFactory } from '@nestjs/core';
import ApplicationModule from 'modules/v1/Api';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  // Enable CORS
  app.use(cors());

  // Block the header from containing information about the server
  app.disable('x-powered-by');

  await app.listen(Config.port, () => {
    const db = secret.databaseInfo;
    console.info(`API server started on ${db.host}:${Config.port}`);
  });
}

bootstrap();
