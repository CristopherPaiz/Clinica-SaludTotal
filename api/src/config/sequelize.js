import { Sequelize } from "sequelize";
import "dotenv/config";

const env = process.env.NODE_ENV || "development";

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false,
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
