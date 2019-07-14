import * as i from 'types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import config from 'config/apiconfig';

@Injectable()
export default class CmsService {
  constructor() {}

  public page = async (pagePath: string) => {
    try {
      const res = await fetch(`${config.cmsDomain}/${pagePath}`);
      const data: i.Pages = await res.json();

      this.cleanupMeta(data);

      return data;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public newsDetail = async (newsItemId: string) => {
    try {
      const res = await fetch(`${config.cmsDomain}/posts/${newsItemId}`);
      const data: i.NewsDetailpage = await res.json();

      delete data.homepage;

      if ('tags' in data) {
        data.tags!.forEach((tag) => {
          delete tag.created_at;
          delete tag.updated_at;
        });
      }

      return data;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  private cleanupMeta = (data: i.Pages) => {
    if ('meta' in data) {
      delete data.meta.aboutpage;
      delete data.meta.loginpage;
      delete data.meta.homepage;
    }
  }
}
