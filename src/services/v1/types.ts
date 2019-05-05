export type CheckTokenResponseSuccess = {
  scope: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  exp: number;
  authorities: {
    authority: string;
  }[];
  client_id: string;
}

export type CheckTokenResponseFailed = {
  error: string;
  error_description: string;
}

export type CheckTokenResponse = CheckTokenResponseSuccess | CheckTokenResponseFailed;
