import * as i from 'types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as entities from 'entities';
import { Service } from './Service';

@Injectable()
export default class UserService extends Service<entities.User> {
  constructor() {
    super(entities.User);
  }

  public create = async (user: i.UserData) => {
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

    try {
      await this.repo.insert(newUser);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Error while creating user', JSON.stringify(err));
    }
  }
}
