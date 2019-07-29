import Discord from 'discord.js';

type MessageCallback = (msg: Discord.Message) => void;

export default abstract class Message {
  constructor(
    protected client: Discord.Client,
    protected listen: string,
  ) {}

  protected onMessage(cb: MessageCallback) {
    this.client.on('message', (msg) => {
      if (msg.content === `!${this.listen}`) {
        cb(msg);
      }
    });
  }
}
