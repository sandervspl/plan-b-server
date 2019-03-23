import { createConnection, Connection } from 'typeorm';
import ormconfig from 'config/ormconfig';
import * as entities from 'entities';
import { Repositories } from 'types';

class Database {
  public connection: Connection;
  public repos: Repositories = {};

  constructor() {
    /* tslint:disable no-console */
    // open connection to database
    createConnection({
      ...ormconfig,
      type: 'mysql',
      entities: Object.values(entities),
    })
      .then((connection) => {
        console.log('Connection to DB succesful');

        this.connection = connection;

        // Set repo on every controller
        this.repos = Object.keys(entities).reduce((all, entity) => {
          return {
            ...all,
            [entity.toLowerCase()]: this.connection.getRepository(entities[entity]),
          };
        }, {});
      })
      .catch((err) => console.log(err));
      /* tslint:enable */
  }
}

const d = new Database();

export default d;
