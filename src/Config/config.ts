import dotenv from 'dotenv';

dotenv.config();

export const config = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    appPort: process.env.APP_PORT,
    jwtSecret: process.env.JWT_SECRET,
    senderEmail: process.env.SENDER_EMAIL,
    senderPass: process.env.SENDER_PASSWORD,
    timeZone: process.env.TIME_ZONE,
};