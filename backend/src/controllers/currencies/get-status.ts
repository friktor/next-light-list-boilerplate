import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Currency } from "../../entity/Currency";
import * as utils from "../../utils";
import { config } from "../../config";

import { CurrenciesStatusQueryParams, CurrenciesStatusResponse } from "../../dto";
import { In } from "typeorm";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{ Querystring: CurrenciesStatusQueryParams }>,
  reply: FastifyReply<{ Body: CurrenciesStatusResponse }>
) {
  const sessionId = utils.getSessionId(request);
  const repo = this.orm.getRepository(Currency);
  const codes = utils.checkCodes(request.query.codes);

  if (!sessionId) {
    reply.status(401).send({ type: "Unauthorized" });
    return;
  }

  const currencies = await repo.find({
    where: Object.assign({ id: sessionId }, codes && { code: In(codes) }),
    select: ["code", "enabled"],
  });

  const data = currencies.reduce<Record<string, boolean>>(
    (map, { code, enabled }) => {
      map[code] = enabled;
      return map;
    },
    {}
  );

  const response: CurrenciesStatusResponse = {
    meta: Object.assign({}, codes && { codes }),
    type: Currency.name,
    data,
  };

  reply.header("session", sessionId).setCookie("session", sessionId, {
    domain: config.DOMAIN,
    sameSite: true,
    secure: true,
    path: "/",
  });

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
