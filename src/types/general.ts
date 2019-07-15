import { Repository } from 'typeorm';
import * as entities from 'entities';

export type Repositories = {
  [R in keyof typeof entities]: Repository<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum AUTH_LEVEL {
  USER,
  ADMIN,
}
