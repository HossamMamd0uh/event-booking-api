import dotenv from 'dotenv';

dotenv.config();

export const config = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    appPort: process.env.APP_PORT
};