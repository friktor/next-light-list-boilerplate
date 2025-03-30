import { FastifyInstance } from "fastify";

import { updateStatus, getStatus } from "./status";
import * as list from "./list";

export async function countries(fastify: FastifyInstance) {
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
