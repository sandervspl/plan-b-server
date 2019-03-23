import * as i from 'types';

/*
    ADD THIS FILE TO GITIGNORE WHEN PUSHING TO GIT
*/

class Secret implements i.SecretInfo {
  /*
      UPDATE THE DATABASE SETTINGS
  */
  public readonly databaseInfo = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'administrator',
    database: 'test',
  };

  public readonly jwtSecret = '<ADD RANDOM STRING HERE>';
}

const s = new Secret();

export default s;
