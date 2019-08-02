import { Repository } from 'typeorm';
import * as entities from 'entities';

export type Repositories = {
  user: Repository<entities.User>;
  applicationmessage: Repository<entities.ApplicationMessage>;
  applicationvote: Repository<entities.ApplicationVote>;
  applicationuuid: Repository<entities.ApplicationUuid>;
}

export enum AUTH_LEVEL {
  USER,
  OFFICER,
  GUILD_MASTER
}

export enum VOTE { REJECT, ACCEPT }
