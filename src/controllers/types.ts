export { CommentType } from './v1/Recruitment/types';
export * from './v1/User/types';

export type PaginationQueries = {
  limit?: number;
  start?: number;
}

export type UserData = {
  username: string;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  avatar?: string;
  discriminator: string;
  id: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
  fetchedAt: Date;
}

export type AugmentedUser = UserData & {
  authLevel: number;
  discordname: string;
}

export type MeResponse = {
  username: string;
  discordname: string;
  avatar?: string;
  id: string;
  authLevel: number;
  dkp: number;
}
