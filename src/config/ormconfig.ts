import * as i from 'types';
import secret from './secret';

const db = secret.databaseInfo;

const ormconfig = {
  type: 'mysql',
  host: db.host,
  port: db.port,
  username: db.user,
  password: db.password,
  database: db.database,
  synchronize: true,
  logging: false,
};

export default ormconfig;
