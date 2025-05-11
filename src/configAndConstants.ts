import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
dotenv.config({
  path: './.env',
});

// Configuration Types
interface Config {
  DATABASE_URL: string;
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
  ACCESS_TOKEN_EXPIRES: string;
  REFRESH_TOKEN_EXPIRES: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'staging';
  BASE_API_URL: string;
  DATABASE_NAME: string;
}

// Configuration
const env: Config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY!,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY!,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES!,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES!,
  PORT: parseInt(process.env.PORT!, 10) || 3000,
  NODE_ENV:
    (process.env.NODE_ENV! as 'development' | 'production' | 'staging') ||
    'development',
  BASE_API_URL: process.env.BASE_API_URL!,
  DATABASE_NAME: process.env.DATABASE_NAME!,
};

// Constants
const cookieOptions = {
  secure: env.NODE_ENV === 'production',
  httpOnly: true,
};
const whitelist: string[] = [
  `http://localhost:${env.PORT}`,
  `https://mehSomeFrontend.com`,
];

const isDev = env.NODE_ENV == 'development';

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if ((isDev && !origin) || whitelist.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS ERROR :: ORIGIN NOT ALLOWED'));
    }
  },
  credentials: true,
};

export { cookieOptions, env, corsOptions };
