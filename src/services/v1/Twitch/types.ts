import * as i from 'types';

export type ActiveStreamer = {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
}

export type ActiveStreamers = {
  data: i.ActiveStreamer[];
  pagination: {
    cursor: string;
  };
}

export type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
}

export type GameData = {
  data: {
    id: string;
    name: string;
    box_art_url: string;
  }[];
}

export type TwitchToken = {
  access_token: string;
  expires_in: number;
  token_type: string;
}
