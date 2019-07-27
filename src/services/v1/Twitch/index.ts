import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';
import _ from 'lodash';
import * as entities from 'entities';
import config from 'config/apiconfig';
import secret from 'config/secret';
import { Service } from '../Service';

@Injectable()
export default class TwitchService extends Service<entities.Streamer> {
  private static readonly headers = {
    'Client-ID': secret.twitch.privateKey,
  };

  constructor() {
    super(entities.Streamer);
  }

  public streamers = async () => {
    try {
      const streamers = await this.repo.find();

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
}
