import qs from 'querystring';
import * as i from 'types';
import { Injectable } from '@nestjs/common';
import oauth2 from 'simple-oauth2';
import fetch from 'node-fetch';
import secretConfig from 'config/secret';
import apiconfig from 'config/apiconfig';

@Injectable()
export default class BlizzardService {
  private accessToken: oauth2.AccessToken;

  public get queries() {
    return {
      locale: 'en_GB',
      access_token: this.accessToken.token.access_token as string, // eslint-disable-line @typescript-eslint/camelcase
    };
  }

  private checkAccessTokenExpired = async (): Promise<boolean> => {
    if (!this.accessToken || !this.accessToken.token) {
      return true;
    }

    const queries = qs.stringify({
      token: this.accessToken.token.access_token,
    });

    const response = await fetch(`https://us.battle.net/oauth/check_token?${queries}`);
    const checkAccessTokenValid: i.CheckTokenResponse = await response.json();

    const checkAccessTokenErr = checkAccessTokenValid as i.CheckTokenResponseFailed;
    if (checkAccessTokenErr.error) {
      return true;
    }

    const checkAccessTokenSuccess = checkAccessTokenValid as i.CheckTokenResponseSuccess;
    const MIN_EXPIRE_TIME = 100;
    if (checkAccessTokenSuccess.exp && checkAccessTokenSuccess.exp <= MIN_EXPIRE_TIME) {
      return true;
    }

    return false;
  }

  public getAccessToken = async (): Promise<oauth2.AccessToken> => {
    const expired = await this.checkAccessTokenExpired();

    // Get new access token
    if (expired) {
      this.accessToken = await this.auth();
    }

    return this.accessToken;
  }

  public auth = async (): Promise<oauth2.AccessToken> => {
    const auth = oauth2.create({
      client: {
        id: secretConfig.blizzard.publicKey,
        secret: secretConfig.blizzard.privateKey,
      },
      auth: {
        tokenHost: apiconfig.battlenetApiUrl,
      },
    });

    const token = await auth.clientCredentials.getToken({ scope: '' });
    this.accessToken = await auth.accessToken.create(token);

    return this.accessToken;
  }
}
