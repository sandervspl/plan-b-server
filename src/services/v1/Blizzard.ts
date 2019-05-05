import qs from 'querystring';
import * as i from 'types';
import { Injectable } from '@nestjs/common';
import oauth2 from 'simple-oauth2';
import fetch from 'node-fetch';
import blizzardConfig from 'config/blizzard';
import apiconfig from 'config/apiconfig';

@Injectable()
export default class BlizzardService {
  private accessToken: oauth2.AccessToken;

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
    if (checkAccessTokenSuccess.exp && checkAccessTokenSuccess.exp <= 100) {
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
        id: blizzardConfig.publicKey,
        secret: blizzardConfig.privateKey,
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
