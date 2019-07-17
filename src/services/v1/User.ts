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

  public create = async (user: Omit<entities.User, 'createdAt' | 'updatedAt'>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [users, userAmount] = await this.repo.findAndCount({ id: user.id });

    // User with ID exists
    if (userAmount > 0) {
      return;
    }

    // Create user
    const newUser = new entities.User();
    newUser.id = user.id;
    newUser.dkp = 0;
    newUser.authLevel = user.authLevel;
    newUser.username = user.username;

    try {
      await this.repo.insert(newUser);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Error while creating user', JSON.stringify(err));
    }
  }
}
