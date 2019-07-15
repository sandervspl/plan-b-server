import { EntitySchema } from 'typeorm';
import Database from 'database';

export abstract class Service<E> {
  constructor(
    protected entity: string | (() => {}) | (new () => E) | EntitySchema<E>
  ) {}

  protected get database() {
    return Database.connection;
  }

  protected get repo() {
    return Database.connection.getRepository<E>(this.entity);
  }
}
