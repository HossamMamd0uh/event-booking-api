import { config } from "./config";
import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Event } from "../models/event";
import { Category } from "../models/category";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.dbHost,
  port: 3306,
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  entities: [User, Event, Category],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
