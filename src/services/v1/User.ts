import * as i from 'types';
import {
  Injectable, InternalServerErrorException, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as entities from 'entities';
import { ERROR_NUM } from 'helpers';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(entities.User)
    private readonly userRepo: Repository<entities.User>,
    @InjectRepository(entities.Character)
    private readonly characterRepo: Repository<entities.Character>,
  ) {}

  public single = async (id: string) => {
    try {
      const user = await this.userRepo.findOne(id, {
        relations: ['character'],
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (err) {
      throw new InternalServerErrorException('Error finding user', err);
    }
  }

  // Create user
  public create = async (user: i.CreateUserBody) => {
    try {
      const newUser = new entities.User();
      newUser.id = user.id;
      newUser.authLevel = user.authLevel;
      newUser.username = user.username;
      newUser.avatar = user.avatar;

      await this.userRepo.save(newUser);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Error creating user', err);
    }
  }

  public linkCharacterToUser = async (body: i.LinkCharacterToUserBody, user: i.AugmentedUser) => {
    try {
      const character = await this.characterRepo.findOneOrFail({
        where: {
          name: body.characterName,
        },
      });

      await this.userRepo.update(user.id, { character });

      return {};
    } catch (err) {
      if (err && err.name === 'EntityNotFound') {
        throw new NotFoundException('Character not found');
      }

      throw new InternalServerErrorException('Error linking character to user', err);
    }
  }

  public createCharacter = async (body: i.CreateCharacterBody) => {
    try {
      const character = new entities.Character();
      character.name = body.characterName;

      const newCharacter = await this.characterRepo.save(character);

      return newCharacter;
    } catch (err) {
      if (err && err.errno === ERROR_NUM.DUPLICATE_ENTRY) {
        throw new BadRequestException('Character already exists.');
      }

      throw new InternalServerErrorException('Error creating character', err);
    }
  }

  public singleCharacter = async (user: i.AugmentedUser) => {
    try {
      const dbUser = await this.userRepo.findOneOrFail(user.id, {
        relations: ['character', 'character.dkpHistories'],
      });

      if (!dbUser.character) {
        throw new NotFoundException('No character found for user');
      }

      return dbUser.character;
    } catch (err) {
      throw new InternalServerErrorException('Error retrieving character', err);
    }
  }
}
