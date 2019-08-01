import * as i from 'types';
import _ from 'lodash';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import Database from 'database';
import * as entities from 'entities';
import config from 'config/apiconfig';
import { sortByDate } from 'helpers';
import { In } from 'typeorm';

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

      if ('tags' in data) {
        const newsDetailTagIds = data.tags!.map((tag) => tag.id);

        // Get all posts with intersection tag IDs
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

  public applications = async (status: i.ApplicationStatus) => {
    try {
      const res = await fetch(`${config.cmsDomain}/applications`);
      const data: i.CmsApplicationResponse[] = await res.json();
      const sort = sortByDate('desc');

      const applications = data
        // Filter out applications with requested status
        .filter((app) => app.status === status)
        // Sort by date, descending
        .sort((a, b) => sort(a.created_at, b.created_at))
        // Fix data response
        .map(this.generateApplicationBody);

      if (applications.length === 0) {
        return [];
      }

      const comments = await Database.repos.applicationmessage.find({
        where: {
          applicationId: In(applications.map((app) => app.id)),
        },
      });

      const response = applications.map((app) => ({
        ...app,
        commentsAmount: comments.filter((comment) => comment.applicationId === app.id).length,
      }));

      return response;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  };

  public singleApplication = async (id: number) => {
    try {
      const res = await fetch(`${config.cmsDomain}/applications/${id}`);
      const data: i.CmsApplicationResponse = await res.json();

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

  public addApplication = async (body: i.AddApplicationRequestBody) => {
    const professions = [
      ...body.professions.primary.map((proff) => proff),
      ...body.professions.secondary.map((proff) => proff),
    ];
    const professionIds = professions.map((proff) => proff.id);

    const postBody: i.CmsApplicationBody = {
      age: Number(body.personal.age),
      story: body.personal.story,
      reason: body.personal.reason,
      race: body.character.race,
      professions: professionIds,
      name: body.character.name,
      class: body.character.class,
      characterrole: body.role,
      char_server: body.character.server,
      char_raid_experience: body.raid_experience,
      char_name: body.character.name,
      char_level: body.character.level,
    };

    try {
      const response = await fetch(`${config.cmsDomain}/applications`, {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const application: i.CmsApplicationResponse = await response.json();

      const applicationProfessionsRequests = professions.map((proff) => {
        const appProffBody: i.ApplicationProfessionBody = {
          application: application.id,
          level: Number(proff.level),
          profession: proff.id,
        };

        return new Promise((res) => (
          fetch(`${config.cmsDomain}/applicationprofessions`, {
            method: 'POST',
            body: JSON.stringify(appProffBody),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then((data) => res(data))
        ));
      });

      await Promise.all(applicationProfessionsRequests);

      return {};
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public updateApplicationStatus = async (applicationId: number, body: i.UpdateApplicationStatusBody) => {
    try {
      const response = await fetch(`${config.cmsDomain}/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: body.status,
          locked: body.status !== 'open',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedApplication: i.CmsApplicationResponse = await response.json();

      return this.generateApplicationBody(updatedApplication);
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

  private generateApplicationBody = (application: i.CmsApplicationResponse) => {
    const getProfessionLevel = (id: number) => {
      const detail = application.applicationprofessions.find((proffDetail) => (
        proffDetail.profession === id
      ));

      return detail ? detail.level : 0;
    };

    return {
      id: application.id,
      created_at: application.created_at,
      updated_at: application.updated_at,
      status: application.status,
      locked: application.locked,
      character: {
        name: application.char_name,
        level: application.char_level,
        race: application.race,
        class: application.class,
        role: application.characterrole,
        server: application.char_server,
        raidExperience: application.char_raid_experience,
        professions: {
          primary: application.professions
            .filter((proff) => proff.primary)
            .map((proff) => ({
              id: proff.id,
              icon: proff.icon,
              name: proff.name,
              level: getProfessionLevel(proff.id),
            })),
          secondary: application.professions
            .filter((proff) => !proff.primary)
            .map((proff) => ({
              id: proff.id,
              icon: proff.icon,
              name: proff.name,
              level: getProfessionLevel(proff.id),
            })),
        },
      },
      personal: {
        name: application.name,
        age: application.age,
        story: application.story,
        reason: application.reason,
      },
    };
  }
  /* eslint-enable */
}
