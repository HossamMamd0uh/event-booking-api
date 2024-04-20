import express from 'express';
import pool from '../Config/db';
import {config} from '../Config/config';

const app = express();

async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log('Database connection successful.');
        return true;
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        return false;
    }
}

async function startServer() {
    if (await checkDatabaseConnection()) {
        app.listen(config.appPort, () => {
            console.log('App is listening on port 8000');
        });
    } else {
        console.log('Fix database connection before starting the server.');
    }
}

startServer();

export default app;