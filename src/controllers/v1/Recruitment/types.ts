import * as i from 'types';

export type MessageType = 'private' | 'public' | 'all';

export type ApplicationsParam = {
  status: i.ApplicationStatus;
}

export type ApplicationMessagesParam = {
  id: number;
}

export type ApplicationMessagesQuery = {
  type: i.MessageType;
}

export type SingleApplicationParam = {
  id: number;
}

export type SinglePublicApplicationParam = {
  uuid: string;
}
