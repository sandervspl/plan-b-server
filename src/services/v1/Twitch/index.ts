import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import _ from 'lodash';
import { RichEmbed, TextChannel } from 'discord.js';
import { CronJob } from 'cron';
import * as entities from 'entities';
import config from 'config/apiconfig';
import secret from 'config/secret';
import discordConfig from 'config/discord';
import discordBot from 'bot/Discord';
import { env } from 'helpers';

@Injectable()
export default class TwitchService {
  private static readonly headers = {
    'Client-ID': secret.twitch.privateKey,
  };
  private twitchToken: i.TwitchToken = {
    access_token: '',
    expires_in: -1,
    token_type: 'bearer',
  };

  constructor(
    @InjectRepository(entities.Streamer)
    private readonly StreamerRepo: Repository<entities.Streamer>,
  ) {
    this.init();
  }

  public activeStreamers = async () => {
    try {
      const activeStreams = await this.getStreamers();

      // No streams are live
      if (activeStreams.data.length === 0) {
        return [];
      }

      const publicActiveStreams = activeStreams.data.map((stream) => _.pick(
        stream,
        'id',
        'user_name',
        'title',
        'game_id',
        'type',
        'viewer_count',
        'started_at',
        'thumbnail_url',
      ));


      const usersQueryStr = publicActiveStreams.reduce((prev, stream, i) => {
        if (i === 0) {
          return `?login=${stream.user_name}`;
        }

        return `${prev}&login=${stream.user_name}`;
      }, '');

      const usersResponse = await fetch(`${config.twitchApiUrl}/users${usersQueryStr}`, {
        headers: TwitchService.headers,
      });
      const users: { data: i.TwitchUser[] } = await usersResponse.json();

      const publicUsers = users.data.map((user) => _.pick(
        user,
        'id',
        'display_name',
        'login',
        'profile_image_url'
      ));


      const response = activeStreams.data.map((stream) => ({
        stream: publicActiveStreams.find((pubStream) => pubStream.id === stream.id),
        user: publicUsers.find((user) => user.id === stream.user_id),
      }));

      return response;
    } catch (err) {
      throw new InternalServerErrorException('Error while fetching streamers', JSON.stringify(err));
    }
  }

  public streamChanged = async (body: i.StreamChangeBody) => {
    // REMOVE IF TESTING
    if (!env.isProduction) {
      return;
    }

    const stream = body.data[0];

    // Stream went offline
    if (!stream) {
      return;
    }

    // Get game data
    const gameResponse = await fetch(`https://api.twitch.tv/helix/games?id=${stream.game_id}`, {
      headers: TwitchService.headers,
    });
    const { data: gameData }: i.GameData = await gameResponse.json();
    const game = gameData[0];

    // Get user data
    const userResponse = await fetch(`https://api.twitch.tv/helix/users?id=${stream.user_id}`, {
      headers: TwitchService.headers,
    });
    const { data } = await userResponse.json();
    const userData: i.TwitchUser = data[0];

    // Get discord channel to post in
    const channelId = env.isProduction
      ? '669210316910886932'                // plan-b classic media - livestreams
      : discordConfig.discordTestChannelId; // plan-b testing
    const channel = discordBot.client.channels.get(channelId) as TextChannel;

    const embed = new RichEmbed()
      .setColor('#9146FF')
      .setAuthor('Twitch Live notification', 'https://cms.planbguild.eu/uploads/9544d3d051424d0b996f6325151cb3a3.png')
      .setThumbnail(this.replaceTemplateDimensions(userData.profile_image_url, 80, 80)) // eslint-disable-line
      .setTitle(`${stream.user_name} is now live!`)
      .setURL(`https://www.twitch.tv/${stream.user_name}`)
      .setDescription(stream.title)
      .addBlankField()
      .addField('Game', game.name)
      .setImage(this.replaceTemplateDimensions(stream.thumbnail_url, 325, 183)); // eslint-disable-line

    channel.send(embed);

    return {};
  }


  private init = async () => {
    // Get OAuth token
    const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${secret.discord.clientId}&client_secret=${secret.discord.clientSecret}&grant_type=client_credentials`, {
      method: 'POST',
    });
    this.twitchToken = await tokenResponse.json();

    console.log('twitch access token:', this.twitchToken.access_token);

    // Subscribe to stream changes
    const subscribeToStreamers = async () => {
      const streamers = await this.StreamerRepo.find({
        where: {
          enabled: 1,
        },
      });

      if (!streamers) {
        throw new NotFoundException();
      }

      // Add subscription for every streamer in DB
      streamers.forEach((streamer) => {
        const body = {
          'hub.callback': 'https://api.planbguild.eu/twitch/stream_changed',
          'hub.mode': 'subscribe',
          'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${streamer.id}`,
          'hub.lease_seconds': 864000,
        };

        fetch('https://api.twitch.tv/helix/webhooks/hub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.twitchToken.access_token}`,
          },
          body: JSON.stringify(body),
        });
      });
    };

    // Update subscription every 9 days
    new CronJob('0 0 */9 * *', subscribeToStreamers, undefined, true, 'Europe/Amsterdam');

    // Do initial subscriptions
    subscribeToStreamers();
  }

  private getStreamers = async (): Promise<i.ActiveStreamers> => {
    const streamers = await this.StreamerRepo.find({
      where: {
        enabled: 1,
      },
    });

    if (!streamers) {
      throw new NotFoundException();
    }

    const streamsQueryStr = streamers.reduce((prev, streamer, i) => {
      if (i === 0) {
        return `?user_login=${streamer.twitch_name}`;
      }

      return `${prev}&user_login=${streamer.twitch_name}`;
    }, '');

    const streamsResponse = await fetch(`${config.twitchApiUrl}/streams${streamsQueryStr}`, {
      headers: TwitchService.headers,
    });
    const activeStreams: i.ActiveStreamers = await streamsResponse.json();

    return activeStreams;
  }

  private replaceTemplateDimensions = (str: string, width: number, height: number) => {
    return str
      .replace('{width}', width.toString())
      .replace('{height}', height.toString());
  }
}
