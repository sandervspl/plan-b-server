class Config {
  // eslint-disable-next-line no-magic-numbers
  public readonly port = Number(process.env.PORT) || 8080;
  public readonly domain = process.env.NODE_ENV ? 'localhost' : process.env.PUBLIC_URL;

  public get apiDomain(): string {
    switch (process.env.APP_ENV) {
      case 'test':
        return 'https://api-test.planbguild.eu';
      case 'acceptation':
        return 'https://api-acc.planbguild.eu';
      case 'production':
        return 'https://api.planbguild.eu';
      default:
        return 'http://localhost:8080';
    }
  }

  public get websiteDomain(): string {
    switch (process.env.APP_ENV) {
      case 'test':
        return 'https://dev.planbguild.eu';
      case 'acceptation':
        return 'https://acc.planbguild.eu';
      case 'production':
        return 'https://planbguild.eu';
      default:
        return 'http://localhost:3000';
    }
  }

  public get cmsDomain(): string {
    switch (process.env.APP_ENV) {
      case 'test':
        return 'https://cms-test.planbguild.eu';
      case 'acceptation':
        return 'https://cms-acc.planbguild.eu';
      case 'production':
        return 'https://cms.planbguild.eu';
      default:
        return 'https://cms-test.planbguild.eu';
    }
  }

  public get CORSWhitelist(): string[] {
    const whitelist = [
      'https://dev.planbguild.eu',
      'https://acc.planbguild.eu',
      'https://planbguild.eu',
      'https://www.planbguild.eu',
    ];

    if (process.env.APP_ENV === 'development') {
      whitelist.push('http://localhost:3000');
    }

    return whitelist;
  }

  public readonly battlenetApiUrl = 'https://eu.battle.net';
  public readonly blizzardApiUrl = 'https://eu.api.blizzard.com';
  public readonly discordApiUrl = 'https://discordapp.com/api';
  public readonly discordCdnUrl = 'https://cdn.discordapp.com';
  public readonly twitchApiUrl = 'https://api.twitch.tv/helix';
}

const config = new Config();

export default config;
