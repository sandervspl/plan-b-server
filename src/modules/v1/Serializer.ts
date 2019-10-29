import * as i from 'types';
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
class Serializer extends PassportSerializer {
  serializeUser(user: i.AugmentedUser, done: CallableFunction) {
    done(null, user);
  }

  async deserializeUser(user: i.AugmentedUser, done: CallableFunction) {
    done(null, user);
  }
}

export default Serializer;
