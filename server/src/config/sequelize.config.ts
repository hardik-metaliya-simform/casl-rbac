import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const getEnv = (k: string, fallback?: string) =>
  process.env[k] ?? fallback ?? '';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: (getEnv('DB_DIALECT', 'postgres') as any) || 'postgres',
  host: getEnv('DB_HOST', 'localhost'),
  port: parseInt(getEnv('DB_PORT', '5432'), 10) || 5432,
  username: getEnv('DB_USERNAME', 'postgres'),
  password: getEnv('DB_PASSWORD', 'postgres'),
  database: getEnv('DB_NAME', 'rbac_dev'),
  logging: getEnv('DB_LOGGING', 'false') === 'true',
  autoLoadModels: false,
  synchronize: true,
  sync: { force: true },
};

export default sequelizeConfig;
