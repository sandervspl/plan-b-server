class DiscordConfig {
  public readonly scopes = ['identify'];
  public readonly callbackApiEndpoint = 'auth/callback';

  public get callbackUrl() {
    const env = process.env.NODE_ENV || 'development';
    const host = env === 'development'
      ? 'http://localhost:8080'
      : 'https://api.planbguild.eu';

    return `${host}/${this.callbackApiEndpoint}`;
  }

  public readonly adminIds = [
    '561717969005183018', // pretty cool guy
  ];
}

const discordConfig = new DiscordConfig();

export default discordConfig;
