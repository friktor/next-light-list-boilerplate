import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Currency } from "../../entity/Currency";
import * as utils from "../../utils";
import { config } from "../../config";

import {
  CurrenciesQueryParams,
  CurrenciesResponse,
  PAGE_ITEMS_LIMIT,
  EnrichedCurrency,
  PaginationDto,
} from "../../dto";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Querystring: PaginationDto & CurrenciesQueryParams;
  }>,
  reply: FastifyReply<{ Body: CurrenciesResponse }>
) {
  const sessionId = utils.getSessionId(request);
  const repo = this.orm.getRepository(Currency);
  const page = request.query.page || 1;
  const needAll = !!request.query.all;

  let data: EnrichedCurrency[] = [];

  if (needAll) {
    let statuses = {};

    if (sessionId) {
      statuses = await repo
        .find({
          select: ["code", "enabled"],
          order: { code: "ASC" },
          where: { id: sessionId },
        })
        .then((currencies) =>
          currencies.reduce<Record<string, boolean>>(
            (map, { code, enabled }) => {
              map[code] = enabled;
              return map;
            },
            {}
          )
        );
    }

    data = utils.isoCodes.getSlice(page).map((country) =>
      Object.assign({}, country, {
        enabled: !!statuses[country.countryCode],
      })
    );
  } else {
    if (!sessionId) {
      reply.status(401).send({ type: "Unauthorized" });
      return;
    }

    const currencies = await repo.find({
      skip: PAGE_ITEMS_LIMIT * (page - 1),
      select: ["code", "enabled"],
      take: PAGE_ITEMS_LIMIT,
      order: { code: "ASC" },
      where: { id: sessionId },
    });

    data = currencies.map(({ code, enabled }) =>
      Object.assign({}, utils.isoCodes.getByCode(code), { enabled })
    );
  }

  const response: CurrenciesResponse = {
    type: Currency.name,
    data,
    meta: {
      limit: PAGE_ITEMS_LIMIT,
      page,
    },
  };

  if (sessionId) {
    reply.header("session", sessionId).setCookie("session", sessionId, {
      domain: config.DOMAIN,
      sameSite: true,
      secure: true,
      path: "/",
    });
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
            properties: {
              enabled: { type: "boolean" },
              countryNameEn: { type: "string" },
              countryNameLocal: { type: "string" },
              countryCode: { type: "string" },
              currencyCode: { type: "string" },
              currencyNameEn: { type: "string" },
              tinType: { type: "string" },
              tinName: { type: "string" },
              officialLanguageCode: { type: "string" },
              officialLanguageNameEn: { type: "string" },
              officialLanguageNameLocal: { type: "string" },
              countryCallingCode: { type: "string" },
              areaCodes: { type: "array", optional: true },
              region: { type: "string" },
              flag: { type: "string" },
            },
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
