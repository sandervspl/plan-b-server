import * as i from 'types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import _ from 'lodash';
import Database from 'database';
import * as entities from 'entities';
import config from 'config/apiconfig';
import { sortByDate } from 'helpers';

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

      const modData = data
        // Filter out applications with requested status
        .filter((app) => app.status === status)
        // Sort by date, descending
        .sort((a, b) => sortByDate('desc')(a.created_at, b.created_at))
        // Fix data response
        .map(this.generateApplicationBody);

      return modData;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  };

  public singleApplication = async (id: number) => {
    try {
      const res = await fetch(`${config.cmsDomain}/applications/${id}`);
      const data: i.ApplicationData = await res.json();

      let discussionMessages: entities.ApplicationMessage[] = await Database.repos.applicationmessage.find({
        where: {
          applicationId: id,
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      });

      discussionMessages = discussionMessages.map((msg) => ({
        ...msg,
        user: this.getPublicUser(msg.user),
      }));

      let votes: entities.ApplicationVote[] = await Database.repos.applicationvote.find({
        where: {
          applicationId: id,
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      });

      votes = votes.map((vote) => ({
        ...vote,
        user: this.getPublicUser(vote.user),
      }));

      const applicationBody = this.generateApplicationBody(data);

      return {
        ...applicationBody,
        discussion: discussionMessages,
        votes,
      };
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public addApplicationComment = async (applicationId: number, body: i.AddApplicationCommentBody) => {
    try {
      const newComment = new entities.ApplicationMessage();
      newComment.applicationId = applicationId;
      newComment.text = body.comment;
      newComment.user = await Database.repos.user.findOneOrFail(body.userId);

      const savedComment = await Database.repos.applicationmessage.save(newComment);

      const response = {
        ...savedComment,
        user: this.getPublicUser(savedComment.user),
      };

      return response;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public addApplicationVote = async (applicationId: number, body: i.AddApplicationVoteBody) => {
    try {
      const newVote = new entities.ApplicationVote();
      newVote.applicationId = applicationId;
      newVote.vote = body.vote;
      newVote.user = await Database.repos.user.findOneOrFail(body.userId);

      const savedVote = await Database.repos.applicationvote.save(newVote);

      const response = {
        ...savedVote,
        user: this.getPublicUser(savedVote.user),
      };

      return response;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }


  private getPublicUser = (user: entities.User) => {
    const safeData: (keyof typeof user)[] = [
      'id',
      'username',
      'avatar',
    ];

    return _.pick(user, safeData);
  }

  private cleanupMeta = (data: i.Pages) => {
    if ('meta' in data) {
      delete data.meta.aboutpage;
      delete data.meta.loginpage;
      delete data.meta.homepage;
    }
  }

  /* eslint-disable @typescript-eslint/camelcase */
  private generateApplicationBody = (application: i.ApplicationData) => {
    return {
      id: application.id,
      created_at: application.created_at,
      updated_at: application.updated_at,
      status: application.status,
      character: {
        name: application.char_name,
        level: application.char_level,
        race: application.char_race,
        class: application.class,
        role: application.characterrole,
        server: application.char_server,
        raidExperience: application.char_raid_experience,
        professions: {
          primary: [
            {
              name: application.char_primary_proff_1,
              level: application.char_primary_proff_1_level,
            },
            {
              name: application.char_primary_proff_2,
              level: application.char_primary_proff_2_level,
            },
          ],
          secondary: [
            {
              name: application.char_secondary_proff_1,
              level: application.char_secondary_proff_1_level,
            },
            {
              name: application.char_secondary_proff_2,
              level: application.char_secondary_proff_2_level,
            },
            {
              name: application.char_secondary_proff_3,
              level: application.char_secondary_proff_3_level,
            },
          ],
        },
      },
      personal: {
        name: application.name,
        age: application.age,
        story: application.story,
      },
    };
  }
  /* eslint-enable */
}
