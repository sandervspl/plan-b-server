import * as i from 'types';

export interface DatabaseConnectDetails {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Interface for the class that holds secret info and is ignored by GIT
export interface SecretInfo {
  readonly databaseInfo: DatabaseConnectDetails;
  readonly sessionSecret: string;
  readonly blizzard: i.Oauth2Info;
  readonly discord: i.Oauth2Info & {
    botToken: string;
    planBServerId: string;
  };
  readonly twitch: {
    privateKey: string;
  };
}

export interface Oauth2Info {
  readonly publicKey: string;
  readonly privateKey: string;
}
