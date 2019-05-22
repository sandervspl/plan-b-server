class Config {
  // eslint-disable-next-line no-magic-numbers
  public readonly port = 8080;
  public domain = process.env.NODE_ENV ? 'localhost' : process.env.PUBLIC_URL;

  public get websiteDomain() {
    switch (process.env.APP_ENV) {
      case 'test':
        return 'http://dev.planbguild.eu';
      case 'acceptation':
        return 'https://acc.planbguild.eu';
      case 'production':
        return 'https://planbguild.eu';
      default:
        return 'http://localhost:3000';
    }
  }

  public readonly CORSWhitelist = [
    'http://localhost:3000',
    'http://dev.planbguild.eu',
    'https://acc.planbguild.eu',
    'https://planbguild.eu',
  ];

  public readonly battlenetApiUrl = 'https://eu.battle.net';
  public readonly blizzardApiUrl = 'https://eu.api.blizzard.com';
  public readonly discordApiUrl = 'https://discordapp.com/api';
  public readonly discordCdnUrl = 'https://cdn.discordapp.com';
}

const config = new Config();

export default config;
