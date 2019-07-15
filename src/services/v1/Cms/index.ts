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

  public applications = async (status: i.ApplicationStatus) => {
    try {
      const res = await fetch(`${config.cmsDomain}/applications`);
      const data: i.ApplicationData[] = await res.json();

      /* eslint-disable @typescript-eslint/camelcase */
      const modData = data
        // Filter out applications with requested status
        .filter((app) => app.status === status)
        // Sort by date, descending
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        // Fix data response
        .map((app) => ({
          id: app.id,
          created_at: app.created_at,
          updated_at: app.updated_at,
          character: {
            name: app.char_name,
            level: app.char_level,
            race: app.char_race,
            class: app.class,
            role: app.characterrole,
            server: app.char_server,
            raidExperience: app.char_raid_experience,
            professions: {
              primary: [
                {
                  name: app.char_primary_proff_1,
                  level: app.char_primary_proff_1_level,
                },
                {
                  name: app.char_primary_proff_2,
                  level: app.char_primary_proff_2_level,
                },
              ],
              secondary: [
                {
                  name: app.char_secondary_proff_1,
                  level: app.char_secondary_proff_1_level,
                },
                {
                  name: app.char_secondary_proff_2,
                  level: app.char_secondary_proff_2_level,
                },
                {
                  name: app.char_secondary_proff_3,
                  level: app.char_secondary_proff_3_level,
                },
              ],
            },
          },
          personal: {
            name: app.name,
            age: app.age,
            story: app.story,
          },
        }));
        /* eslint-enable */

      return modData;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  };

  private cleanupMeta = (data: i.Pages) => {
    if ('meta' in data) {
      delete data.meta.aboutpage;
      delete data.meta.loginpage;
      delete data.meta.homepage;
    }
  }
}
