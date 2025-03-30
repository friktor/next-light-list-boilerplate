import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { ROOT_COOKIE_OPTS } from "../../../config";
import { Country } from "../../../entity/Country";
import * as services from "../../../services";
import * as utils from "../../../utils";

import {
  CountriesStatusQueryParams,
  CountriesStatusResponse,
} from "../../../dto";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Querystring: CountriesStatusQueryParams }>,
  reply: FastifyReply<{ Body: CountriesStatusResponse }>
) {
  const codes = utils.checkCodes(request.query.codes);
  const sessionId = utils.getSessionId(request);

  if (!sessionId) {
    reply.status(401).send({ type: "Unauthorized" });
    return;
  }

  const repo = this.orm.getRepository(Country);

  const data = await services.countries.getCountriesStatus(
    repo,
    sessionId,
    codes
  );

  const response: CountriesStatusResponse = {
    meta: Object.assign({}, codes && { codes }),
    type: Country.name,
    data,
  };

  reply
    .setCookie("session", sessionId, ROOT_COOKIE_OPTS)
    .header("session", sessionId);

  reply.status(200).send(response);
}

export const schema: any = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        codes: {
          items: { type: "string" },
          type: "array",
        },
      },
    },
    response: {
      "2xx": {
        type: "object",
        properties: {
          type: { type: "string" },
          data: {
            type: "object",
            patternProperties: {
              ".{1,}": { type: "boolean" },
            },
          },
        },
      },
    },
  },
};
