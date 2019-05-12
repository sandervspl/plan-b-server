class DiscordConfig {
  public readonly scopes = ['identify', 'guilds'];
  public readonly callbackApiEndpoint = 'discord/auth/callback';

  public get callbackUrl() {
    const env = process.env.node_env || 'development';
    const host = env === 'development'
      ? 'http://localhost:8080'
      : 'http://api.planbguild.eu';

    return `http://${host}/${this.callbackApiEndpoint}`;
  }
}

const discordConfig = new DiscordConfig();

export default discordConfig;
