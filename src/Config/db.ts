import { config } from "./config";
import { DataSource } from "typeorm";
import { User } from "../models/user";

const AppDataSource = new DataSource({
  type: "mysql",
  host: config.dbHost,
  port: 3306,
  username: config.dbUser,
  password: config.dbPass,
  database: config.dbName,
  entities: [User],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
