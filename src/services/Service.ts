import { EntitySchema } from 'typeorm';
// import Database from 'database';

export abstract class Service<E> {
  constructor(
    protected entity: string | (() => {}) | (new () => E) | EntitySchema<E>
  ) {}

  // protected get repo() {
    // return Database.connection.getRepository<E>(this.entity);
  // }
}
