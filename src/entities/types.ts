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
