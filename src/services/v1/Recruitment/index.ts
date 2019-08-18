import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import fetch from 'node-fetch';
import _ from 'lodash';
import { sortByDate, generateRandomString } from 'helpers';
import config from 'config/apiconfig';
import * as entities from 'entities';
import { PrimaryProfession } from './types/AddApplicationRequestBody';

@Injectable()
export default class RecruitmentService {
  constructor(
    @InjectRepository(entities.ApplicationMessage)
    private readonly applicationMessageRepo: Repository<entities.ApplicationMessage>,
    @InjectRepository(entities.ApplicationUuid)
    private readonly applicationUuidRepo: Repository<entities.ApplicationUuid>,
    @InjectRepository(entities.ApplicationVote)
    private readonly applicationVoteRepo: Repository<entities.ApplicationVote>,
    @InjectRepository(entities.User)
    private readonly userRepo: Repository<entities.User>,
  ) {}

  public applications = async (status: i.ApplicationStatus, type: i.ViewableType = 'private') => {
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

      // Get comments count
      const comments = await this.applicationMessageRepo.find({
        where: {
          applicationId: In(applications.map((app) => app.id)),
          public: Number(type === 'public'),
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
  }

  public publicApplications = async (status: i.ApplicationStatus) => {
    try {
      const applications = await this.applicationUuidRepo.find();
      const cmsApplications = await this.applications(status, 'public');

      const response = cmsApplications
        .filter((app) => applications.find((uuidApp) => uuidApp.applicationId === app.id))
        .map((app) => ({
          ...app,
          public: applications.find((uuidApp) => uuidApp.applicationId === app.id),
        }));

      return response;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public singleApplication = async (id: number) => {
    try {
      const res = await fetch(`${config.cmsDomain}/applications/${id}`);
      const data: i.CmsApplicationResponse = await res.json();

      let votes: entities.ApplicationVote[] = await this.applicationVoteRepo.find({
        where: {
          applicationId: id,
        },
        relations: ['user'],
      });

      votes = votes.map((vote) => ({
        ...vote,
        user: this.getPublicUser(vote.user),
      }));

      const applicationBody = this.generateApplicationBody(data);

      return {
        ...applicationBody,
        votes,
      };
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public singlePublicApplication = async (uuid: string) => {
    try {
      const application = await this.applicationUuidRepo.findOne({ where: { uuid } });
      if (!application) {
        throw new NotFoundException();
      }

      const applicationDetail = await this.singleApplication(application.applicationId);

      if (!applicationDetail) {
        throw new NotFoundException();
      }

      delete applicationDetail.votes;

      return applicationDetail;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public getComments = async (applicationId: number, type: i.ViewableType) => {
    const messagesTypeQuery: Record<string, number> = {};

    if (type !== 'all') {
      messagesTypeQuery.public = Number(type === 'public');
    }

    try {
      let messages = await this.applicationMessageRepo.find({
        where: {
          applicationId,
          ...messagesTypeQuery,
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      });

      messages = messages.map((msg) => ({
        ...msg,
        user: this.getPublicUser(msg.user),
      }));

      return messages;
    } catch (err) {
      throw new InternalServerErrorException(null, err);
    }
  }

  public addComment = async (applicationId: number, body: i.AddApplicationCommentBody) => {
    try {
      const newComment = new entities.ApplicationMessage();
      newComment.applicationId = applicationId;
      newComment.text = body.comment;
      newComment.public = body.isPublic;
      newComment.user = await this.userRepo.findOneOrFail(body.userId);

      const savedComment = await this.applicationMessageRepo.save(newComment);

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
      const user = await this.userRepo.findOneOrFail(body.userId);

      const hasVoted = await this.applicationVoteRepo.find({
        where: {
          user,
          applicationId,
        },
      });

      if (hasVoted.length > 0) {
        throw new MethodNotAllowedException('User has already voted.');
      }

      const newVote = new entities.ApplicationVote();
      newVote.applicationId = applicationId;
      newVote.vote = body.vote;
      newVote.user = user;

      const savedVote = await this.applicationVoteRepo.save(newVote);

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
        professions = [...body.professions.primary.filter(Boolean)];
      }

      if (body.professions.secondary) {
        professions = [...professions, ...body.professions.secondary.filter(Boolean)];
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
      char_raid_experience: body.raid_experience || {},
      char_name: body.character.name,
      char_level: body.character.level,
      social: body.social,
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

      const idLength = 8;
      applicationHash.uuid = generateRandomString(idLength);

      const newUuid = await this.applicationUuidRepo.save(applicationHash);

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
      'authLevel',
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
      social: application.social,
    };
  }
}
