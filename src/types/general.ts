import * as i from 'types'; // eslint-disable-line
import { Repository } from 'typeorm';

export interface Repositories {
  [index: string]: Repository<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum AUTH_LEVEL {
  USER,
  ADMIN,
}
