import express from "express";
import AppDataSource from "../config/db";
import { config } from "../config/config";
import userRoutes from "../routes/userRoutes";
import eventRoutes from "../routes/eventRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import ticketRoutes from "../routes/ticketRoutes";
import authRoutes from "../routes/authRoutes";
import {scheduleNotifications} from "../helpers/notificationsHelpers";
const app = express();

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
    await checkDatabaseConnection();
    initializeApp();
    startServer(config.appPort);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

start();

export default app;
