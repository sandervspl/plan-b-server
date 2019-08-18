import { ConnectionOptions } from 'typeorm';
import secret from './secret';

const db = secret.databaseInfo;

const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: db.host,
  port: db.port,
  username: db.user,
  password: db.password,
  database: db.database,
  synchronize: true,
  logging: false,
  charset: 'utf8mb4',
};

export default ormconfig;
