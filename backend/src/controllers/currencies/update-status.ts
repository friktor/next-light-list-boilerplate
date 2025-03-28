import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Currency } from "../../entity/Currency";
import * as utils from "../../utils";
import { config } from "../../config";

import {
  UpdateCurrencyStatusResponse,
  UpdateCurrencyStatusDto,
  updateCurrencyStatusDto,
} from "../../dto";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateCurrencyStatusDto;
  }>,
  reply: FastifyReply<{
    Body: UpdateCurrencyStatusResponse;
  }>
) {
  const sessionId = utils.getSessionId(request);
  const { code, enabled } = request.body;

  if (!sessionId) {
    reply.status(401).send({ type: "Unauthorized" });
    return;
  }

  const currency = Currency.create(code, enabled, sessionId);
  const repo = this.orm.getRepository(Currency);

  await repo.upsert(currency, {
    conflictPaths: ["id", "code"],
    skipUpdateIfNoValuesChanged: true,
    upsertType: "on-conflict-do-update",
  });

  const response: UpdateCurrencyStatusResponse = {
    type: Currency.name,
    data: currency,
    meta: {},
  };

  reply.header("session", sessionId).setCookie("session", sessionId, {
    domain: config.DOMAIN,
    sameSite: true,
    secure: true,
    path: "/",
  });

  reply.status(200).send(response);
}

export const preValidation = utils.validate(updateCurrencyStatusDto);

export const schema: any = {
  body: {
    type: "object",
    properties: {
      enabled: { type: "boolean" },
      code: { type: "string" },
    },
    required: ["code", "enabled"],
  },
  response: {
    "2xx": {
      type: "object",
      properties: {
        type: { type: "string" },
        data: {
          type: "object",
          properties: {
            enabled: { type: "boolean" },
            code: { type: "string" },
            sessionId: { type: "string" },
          },
        },
      },
    },
  },
};
