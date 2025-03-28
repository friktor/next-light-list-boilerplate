import database from "typeorm-fastify-plugin";
import swaggerUI from "@fastify/swagger-ui";
import swagger from "@fastify/swagger";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Fastify from "fastify";

import * as controllers from "./controllers";
import * as config from "./config";

export function setup() {
    const app = Fastify({ logger: true });

    return app
      .register(database, config.DATASOURCE)
      .register(cookie, config.COOKIE)
      .register(cors, config.CORS)
      .register(swagger)
      .register(swaggerUI, { routePrefix: "/api/swagger" })
      .register(controllers.currencies, { prefix: "/api/currency" });
}
