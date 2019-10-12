import * as i from 'types';

export type ViewableType = 'private' | 'public' | 'all';

export type ApplicationsParam = {
  status: i.ApplicationStatus;
}

export type ApplicationMessagesParam = {
  id: number;
}

export type ApplicationMessagesQuery = {
  type: i.ViewableType;
}

export type SingleApplicationParam = {
  id: number;
}
