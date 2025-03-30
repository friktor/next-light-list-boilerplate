import { FastifyInstance } from "fastify";
import * as list from "./list";

export async function currencies(fastify: FastifyInstance) {
  fastify.get("/", { schema: list.schema }, list.handler.bind(fastify));
}
