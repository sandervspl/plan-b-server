import * as i from 'types';
import _ from 'lodash';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import config from 'config/apiconfig';

@Injectable()
export default class CmsService {
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

      // Delete reference
      delete data.homepage;

      const allPostsRes = await fetch(`${config.cmsDomain}/posts`);
      let allPosts: i.NewsDetailpage[] = await allPostsRes.json();

      // Filter out requested article
      allPosts = allPosts.filter((post) => post.id !== data.id);

      let relatedNews: i.NewsDetailpage[] = [];

      // Get related news based on tags
      if ('tags' in data) {
        const newsDetailTagIds = data.tags!.map((tag) => tag.id);

        // Get all posts with intersecting tag IDs
        relatedNews = allPosts.filter((post) => {
          if (!post.tags) return false;
          if (!post.published) return false;

          const postTagIds = post.tags.map((tag) => tag.id);

          // Check if there are related tags on this post
          const intersections = _.intersection(newsDetailTagIds, postTagIds);

          // Found a post with similar tags
          if (intersections.length > 0) {
            return true;
          }

          return false;
        });
      }

      return {
        ...data,
        relatedNews,
      };
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
