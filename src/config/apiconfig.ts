class Config {
  public readonly port = 8080;
  public readonly domain = process.env.NODE_ENV === 'development' ? 'localhost' : process.env.PUBLIC_URL;
  public readonly battlenetApiUrl = 'https://eu.battle.net';
  public readonly blizzardApiUrl = 'https://eu.api.blizzard.com';
}

export default new Config();
