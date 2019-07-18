import { Repository } from 'typeorm';
import * as entities from 'entities';

export type Repositories = {
  user: Repository<entities.User>;
  applicationmessage: Repository<entities.ApplicationMessage>;
}

export enum AUTH_LEVEL {
  USER,
  ADMIN,
}
