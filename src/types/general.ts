import * as i from 'types';
import { Repository } from 'typeorm';

export interface AuthRequest extends i.Request {
  token: string;
}

export interface Repositories {
  [index: string]: Repository<any>;
}
