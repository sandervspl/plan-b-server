import * as i from 'types';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as entities from 'entities';
import { Service } from './Service';

@Injectable()
export default class UserService extends Service<entities.User> {
  constructor() {
    super(entities.User);
  }

  public single = async (id: string) => {
    try {
      const user = await this.repo.findOne(id);

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (err) {
      throw new InternalServerErrorException('Error while finding user', JSON.stringify(err));
    }
  }

  // Create user
  public create = async (user: i.CreateUserBody) => {
    const newUser = new entities.User();
    newUser.id = user.id;
    newUser.dkp = 0;
    newUser.authLevel = user.authLevel;
    newUser.username = user.username;
    newUser.avatar = user.avatar;

    try {
      await this.repo.save(newUser);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Error while creating user', JSON.stringify(err));
    }
  }
}
