import config from './apiconfig';

class DiscordConfig {
  public readonly scopes = ['identify'];
  public readonly callbackApiEndpoint = 'auth/callback';

  public get callbackUrl() {
    return `${config.apiDomain}/${this.callbackApiEndpoint}`;
  }

  public readonly adminIds = [
    '561717969005183018', // Guild Officer
  ];
}

const discordConfig = new DiscordConfig();

export default discordConfig;
