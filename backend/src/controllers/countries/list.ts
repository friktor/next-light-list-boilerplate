import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ROOT_COOKIE_OPTS } from "../../config";
import { Country } from "../../entity/Country";
import * as services from "../../services";
import * as utils from "../../utils";

import {
  CountriesQueryParams,
  CountriesResponse,
  PAGE_ITEMS_LIMIT,
  PaginationDto,
} from "../../dto";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Querystring: PaginationDto & CountriesQueryParams;
  }>,
  reply: FastifyReply<{ Body: CountriesResponse }>
) {
  const sessionId = utils.getSessionId(request);
  const includeAll = !!request.query.all;
  const page = request.query.page || 1;

  if (!includeAll && !sessionId) {
    reply.status(401).send({ type: "Unauthorized" });
    return;
  }

  const repo = this.orm.getRepository(Country);

  const data = await services.countries.getCountriesList(repo, {
    includeAll,
    sessionId,
    page,
  });

  const response: CountriesResponse = {
    type: Country.name,
    data,
    meta: {
      limit: PAGE_ITEMS_LIMIT,
      page,
    },
  };

  if (sessionId) {
    reply
      .setCookie("session", sessionId, ROOT_COOKIE_OPTS)
      .header("session", sessionId);
  }

  reply.status(200).send(response);
}

export const schema: any = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", minimum: 1 },
      all: { type: "boolean" },
    },
  },
  response: {
    "2xx": {
      type: "object",
      properties: {
        type: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: Object.assign({}, utils.countrySchema.properties, {
              enabled: { type: "boolean" },
            }),
          },
        },
        meta: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer" },
          },
        },
      },
    },
  },
};
