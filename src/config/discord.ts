class DiscordConfig {
  public readonly scopes = ['identify', 'guilds'];
  public readonly callbackApiEndpoint = 'discord/auth/callback';

  public get callbackUrl() {
    const env = process.env.NODE_ENV || 'development';
    const host = env === 'development'
      ? 'http://localhost:8080'
      : 'http://api.planbguild.eu';

    return `${host}/${this.callbackApiEndpoint}`;
  }
}

const discordConfig = new DiscordConfig();

export default discordConfig;
