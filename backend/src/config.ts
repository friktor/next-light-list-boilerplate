import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import path from "path";

import { Country } from "./entity/Country";

const envPath = path.join(
  __dirname,
  "..",
  process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env"
);

dotenv.config({
  path: envPath,
});

export const config = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,

  COOKIE_SECRET: process.env.COOKIE_SECRET,
  PORT: parseInt(process.env.PORT),
  ORIGIN: process.env.ORIGIN,
  DOMAIN: process.env.DOMAIN,
};

const MIGRATIONS_PATH = path.join(__dirname, "./migrations/**/*.{js,ts}");

export const DATASOURCE: DataSourceOptions = {
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  port: config.DB_PORT,
  host: config.DB_HOST,
  type: "postgres",

  migrations: [MIGRATIONS_PATH],
  entities: [Country],
  logging: true,
};

export const COOKIE: FastifyCookieOptions = {
  secret: config.COOKIE_SECRET,
  hook: "preHandler",
};

export const ROOT_COOKIE_OPTS = {
  domain: config.DOMAIN,
  sameSite: true,
  secure: true,
  path: "/",
}

export const CORS: FastifyCorsOptions = {
  methods: ["GET", "HEAD", "POST", "PATCH"],
  origin: config.ORIGIN,
};

export const PORT = config.PORT;
