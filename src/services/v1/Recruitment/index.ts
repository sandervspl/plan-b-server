import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import fetch from 'node-fetch';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { sortByDate } from 'helpers';
import Database from 'database';
import config from 'config/apiconfig';
import * as entities from 'entities';
import { PrimaryProfession } from './types/AddApplicationRequestBody';

@Injectable()
export default class RecruitmentService {
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

  public singlePublicApplication = async (uuid: string) => {
    try {
      const application = await Database.repos.applicationuuid.findOne({ where: { uuid } });
      if (!application) {
        throw new NotFoundException();
      }

      const applicationDetail = await this.singleApplication(application.applicationId);

      if (!applicationDetail) {
        throw new NotFoundException();
      }

      delete applicationDetail.discussion;
      delete applicationDetail.votes;

      return applicationDetail;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  };

  public addApplicationComment = async (applicationId: number, body: i.AddApplicationCommentBody) => {
    try {
      const newComment = new entities.ApplicationMessage();
      newComment.applicationId = applicationId;
      newComment.text = body.comment;
      newComment.public = body.isPublic;
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
    let professions: PrimaryProfession[] = [];

    if (body.professions) {
      if (body.professions.primary) {
        professions = [...body.professions.primary];
      }

      if (body.professions.secondary) {
        professions = [...professions, ...body.professions.secondary];
      }
    }

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
      const newApplication: i.CmsApplicationResponse = await response.json();

      const applicationProfessionsRequests = professions.map((proff) => {
        const appProffBody: i.ApplicationProfessionBody = {
          application: newApplication.id,
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

      // Create unique uuid for application
      const applicationHash = new entities.ApplicationUuid();
      applicationHash.applicationId = newApplication.id;
      applicationHash.uuid = uuidv4();

      const newUuid = await Database.repos.applicationuuid.save(applicationHash);

      return {
        applicationUuid: newUuid.uuid,
      };
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
}
