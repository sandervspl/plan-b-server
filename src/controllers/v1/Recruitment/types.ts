import * as i from 'types';

export type CommentType = 'private' | 'public';

export type ApplicationsParam = {
  status: i.ApplicationStatus;
}

export type ApplicationMessagesParam = {
  uuid: string;
}

export type ApplicationMessagesQuery = {
  type: i.CommentType;
}

export type SingleApplicationParam = {
  uuid: string;
}
