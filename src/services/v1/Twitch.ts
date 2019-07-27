import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';
import _ from 'lodash';
import * as entities from 'entities';
import config from 'config/apiconfig';
import secret from 'config/secret';
import { Service } from './Service';

@Injectable()
export default class TwitchService extends Service<entities.Streamer> {
  constructor() {
    super(entities.Streamer);
  }

  public streamers = async () => {
    try {
      const streamers = await this.repo.find();

      if (!streamers) {
        throw new NotFoundException();
      }

      const queryStr = streamers.reduce((prev, streamer, i) => {
        if (i === 0) {
          return `?user_login=${streamer.twitch_name}`;
        }

        return `${prev}&user_login=${streamer.twitch_name}`;
      }, '');

      const twitchResponse = await fetch(`${config.twitchApiUrl}/streams${queryStr}`, {
        headers: {
          'Client-ID': secret.twitch.privateKey,
        },
      });
      const activeStreams: i.ActiveStreamers = await twitchResponse.json();

      return activeStreams.data.map((stream) => _.pick(
        stream,
        'id',
        'user_name',
        'game_id',
        'type',
        'viewer_count',
        'started_at',
        'thumbnail_url',
      ));
    } catch (err) {
      throw new InternalServerErrorException('Error while fetching streamers', JSON.stringify(err));
    }
  }
}
