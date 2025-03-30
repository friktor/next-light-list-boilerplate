import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ROOT_COOKIE_OPTS } from "../../../config";
import { Country } from "../../../entity/Country";
import * as services from "../../../services";
import * as utils from "../../../utils";

import {
  UpdateCountryStatusResponse,
  UpdateCountryStatusDto,
  updateCountryStatusDto,
} from "../../../dto";

export async function handler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateCountryStatusDto;
  }>,
  reply: FastifyReply<{
    Body: UpdateCountryStatusResponse;
  }>
) {
  const sessionId = utils.getSessionId(request);
  const { code, enabled } = request.body;

  if (!sessionId) {
    reply.status(401).send({ type: "Unauthorized" });
    return;
  }

  const repo = this.orm.getRepository(Country);
  
  const country = await services.countries.updateCountryStatus(repo, {
    sessionId,
    enabled,
    code,
  });

  const response: UpdateCountryStatusResponse = {
    type: Country.name,
    data: country,
    meta: {},
  };

  reply
    .setCookie("session", sessionId, ROOT_COOKIE_OPTS)
    .header("session", sessionId);

  reply.status(200).send(response);
}

export const preValidation = utils.validate(updateCountryStatusDto);

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
          },
        },
      },
    },
  },
};
