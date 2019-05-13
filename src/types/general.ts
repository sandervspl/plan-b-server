import * as i from 'types'; // eslint-disable-line
import { Repository } from 'typeorm';

declare global {
  // eslint-disable-next-line
  namespace Express {
    interface Request {
      user?: i.UserData & {
        authLevel: number;
        avatarUrl: string;
      };
    }
  }
}

export interface Repositories {
  [index: string]: Repository<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}
