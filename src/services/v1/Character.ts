import qs from 'querystring';
import { Injectable, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';
import oauth2 from 'simple-oauth2';
import apiconfig from 'config/apiconfig';

@Injectable()
export default class CharacterService {
  private readonly SERVER = 'ragnaros';

  public async single(name: string, accessToken: oauth2.AccessToken) {
    const queries = qs.stringify({
      locale: 'en_GB',
      access_token: accessToken.token.access_token, // eslint-disable-line @typescript-eslint/camelcase
      fields: 'guild',
    });

    try {
      const response = await fetch(
        `${apiconfig.blizzardApiUrl}/wow/character/${this.SERVER}/${name}?${queries}`
      );
      const data = await response.json();

      return data;
    } catch (err) {
      throw new NotFoundException(name, err);
    }
  }
}
