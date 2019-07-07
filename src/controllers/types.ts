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
