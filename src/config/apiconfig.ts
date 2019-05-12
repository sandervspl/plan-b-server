class Config {
  public readonly port = 8080;
  public readonly domain = process.env.NODE_ENV === 'development'
    ? 'localhost'
    : process.env.PUBLIC_URL;
  public readonly battlenetApiUrl = 'https://eu.battle.net';
  public readonly blizzardApiUrl = 'https://eu.api.blizzard.com';
  public readonly discordApiUrl = 'https://discordapp.com/api';
}

const config = new Config();

export default config;
