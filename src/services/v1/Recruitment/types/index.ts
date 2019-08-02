import * as i from 'types';
export { AddApplicationRequestBody } from './AddApplicationRequestBody';
export { ApplicationProfessionBody } from './ApplicationProfession';
export { CmsApplicationResponse, CmsApplicationBody } from './CmsApplication';

export type AddApplicationCommentBody = {
  userId: string;
  comment: string;
}

export type AddApplicationVoteBody = {
  userId: string;
  vote: i.VOTE;
}

export type UpdateApplicationStatusBody = {
  status: i.ApplicationStatus;
}

export type RaidExperience = {
  molten_core: boolean;
  onyxia: boolean;
  blackwing_lair: boolean;
  zul_gurub: boolean;
  aq_20: boolean;
  aq_40: boolean;
  naxxramas: boolean;
}

export type ApplicationStatus = 'open' | 'accepted' | 'rejected';
