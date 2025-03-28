import { FastifyInstance } from "fastify";

import * as updateStatus from "./update-status";
import * as getStatus from "./get-status";
import * as list from "./list";

export async function currencies(fastify: FastifyInstance) {
  fastify.get("/", { schema: list.schema }, list.handler.bind(fastify));

  fastify.get(
    "/status",
    { schema: getStatus.schema },
    getStatus.handler.bind(fastify)
  );

  fastify.patch(
    "/status",
    {
      preValidation: updateStatus.preValidation,
      schema: updateStatus.schema,
    },
    updateStatus.handler.bind(fastify)
  );
}
