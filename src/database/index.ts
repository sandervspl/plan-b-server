import { createConnection, Connection } from 'typeorm';
import ormconfig from 'config/ormconfig';
import * as entities from 'entities';
import { Repositories } from 'types';

class Database {
  public connection!: Connection;
  public repos!: Repositories;

  constructor() {
    // Open connection to database
    createConnection({
      ...ormconfig,
      entities: Object.values(entities),
    })
      .then((connection) => {
        console.info('Connection to DB succesful');

        this.connection = connection;

        // Create repo of every entity
        this.repos = Object.keys(entities).reduce((all, entity) => {
          return {
            ...all,
            // @ts-ignore I don't understand this type error
            [entity.toLowerCase()]: this.connection.getRepository(entities[entity]),
          };
        }, {} as Repositories);
      })
      .catch((err) => console.error(err));
  }
}

const db = new Database();

export default db;
