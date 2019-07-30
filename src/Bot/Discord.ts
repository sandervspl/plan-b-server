import Discord from 'discord.js';
import secretConfig from 'config/secret';

class DiscordBot {
  public readonly client = new Discord.Client();

  constructor() {
    this.client.login(secretConfig.discord.botToken);

    this.client.on('ready', () => {
      console.info('Discord bot activated.');
    });
  }
}

const discordService = new DiscordBot();

export default discordService;
