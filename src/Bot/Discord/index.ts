import Discord from 'discord.js';
import secretConfig from 'config/secret';
import messages from './messages';

class DiscordBot {
  public readonly client = new Discord.Client();

  constructor() {
    this.client.login(secretConfig.discord.botToken);

    this.client.on('ready', () => {
      console.info('Discord bot activated.');
    });

    this.initMessageServices();
  }

  private initMessageServices = () => {
    messages.forEach((message) => new message(this.client));
  }
}

const discordService = new DiscordBot();

export default discordService;
