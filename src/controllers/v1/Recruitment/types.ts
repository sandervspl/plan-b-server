import * as i from 'types';

export type ApplicationsParam = {
  status: i.ApplicationStatus;
}

export type SingleApplicationParam = {
  id: number;
}

export type SinglePublicApplicationParam = {
  uuid: string;
}
