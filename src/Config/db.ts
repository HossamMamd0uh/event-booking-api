import { config } from "./config";
import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Event } from "../models/event";
import { Category } from "../models/category";
import { Ticket } from "../models/ticket";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.dbHost,
  port: 3306,
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  entities: [User, Event, Category, Ticket],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
