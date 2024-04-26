import express from "express";
import AppDataSource from "../config/db";
import { config } from "../config/config";
import userRoutes from "../routes/userRoutes";
import eventRoutes from "../routes/eventRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import ticketRoutes from "../routes/ticketRoutes";
import authRoutes from "../routes/authRoutes";
import {scheduleNotifications} from "../helpers/notificationsHelpers";
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from '../common/swaggerConfig';
import * as mysql from 'mysql2';

const app = express();

async function initDB() {
  return new Promise<void>((resolve, reject) => {
    const connection = mysql.createConnection({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPass,
    });
    connection.connect();
    connection.query(`CREATE DATABASE IF NOT EXISTS ${config.dbName}`, (err, result) => {
      if (err) {
        console.error("Error creatin database:", err);
        reject(err);
      } else {
        console.log("Database initiated successfully");
        resolve();
      }
    });
    connection.end();
  });
}


async function checkDatabaseConnection() {
  try {
    await AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    return true;
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    return false;
  }
}

function initializeApp() {
  try {
    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/health", (req, res) => {
      res.send({"status": "ok"});
    });
    app.use("/users", userRoutes);
    app.use("/events", eventRoutes);
    app.use("/categories", categoryRoutes);
    app.use("/tickets", ticketRoutes);
    app.use("/auth", authRoutes);
  } catch (err) {
    console.error("Error initializing app:", err);
  }
}

function startServer(port: string) {
  scheduleNotifications();
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}

async function start() {
  try {
    await initDB();
    await checkDatabaseConnection();
    initializeApp();
    startServer(config.appPort);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

start();

export default app;
