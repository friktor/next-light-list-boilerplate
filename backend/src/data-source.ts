import "reflect-metadata";

import { DataSource } from "typeorm";
import * as config from "./config";

export const AppDataSource = new DataSource(config.DATASOURCE);
