import config from './apiconfig';

class DiscordConfig {
  public readonly scopes = ['identify'];
  public readonly callbackApiEndpoint = 'auth/callback';

  public get callbackUrl() {
    return `${config.apiDomain}/${this.callbackApiEndpoint}`;
  }

  public readonly adminIds = [
    '561717969005183018', // Guild Officer
    '622436428177080366', // Class Leader
  ];

  public readonly guildLeaderId = '602127893883256862';

  public readonly discordTestChannelId = '668943349306097724';
}

const discordConfig = new DiscordConfig();

export default discordConfig;
