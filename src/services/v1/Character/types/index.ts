import * as i from 'types';
export * from './character';

export type ClassDataResponse = {
  classes: i.ClassData[];
}

export type ClassData = {
  id: number;
  mask: number;
  powerType: string;
  name: string;
}
