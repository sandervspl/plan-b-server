import { Injectable, InternalServerErrorException } from '@nestjs/common';
import oauth2 from 'simple-oauth2';
import blizzardConfig from 'config/blizzard';
import apiconfig from 'config/apiconfig';

@Injectable()
export default class BlizzardService {
  private accessToken: oauth2.AccessToken;

  public async getAccessToken() {
    // Get new access token
    if (!this.accessToken || this.accessToken.expired()) {
      this.accessToken = await this.auth();
    }

    return this.accessToken;
  }

  public async auth() {
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
