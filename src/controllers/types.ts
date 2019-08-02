export { MessageType } from './v1/Recruitment/types';

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
