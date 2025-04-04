import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { CurrenciesResponse, PAGE_ITEMS_LIMIT, PaginationDto } from "../../dto";
import { ROOT_COOKIE_OPTS } from "../../config";
import { Country } from "../../entity/Country";
import * as services from "../../services";
import * as utils from "../../utils";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Querystring: PaginationDto;
  }>,
  reply: FastifyReply<{ Body: CurrenciesResponse }>
) {
  const sessionId = utils.getSessionId(request);
  const page = request.query.page || 1;

  const repo = this.orm.getRepository(Country);

  const data = await services.currencies.getCurrencies(repo, {
    sessionId,
    page,
  });

  const response: CurrenciesResponse = {
    type: "Currencies",
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
            properties: Object.assign({}, utils.currencySchema.properties, {
              countries: {
                type: "array",
                items: {
                  type: "object",
                  properties: Object.assign(
                    {},
                    utils.countrySchema.properties,
                    { enabled: { type: "boolean" } }
                  ),
                },
              },
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
