import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";
import { isoCodes } from "./countries";

export const validate = (schema: Joi.ObjectSchema) => {
  return (
    request: FastifyRequest,
    _reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    try {
      const { error } = schema.validate(request.body);
      if (error) {
        throw error;
      }
      done();
    } catch (error) {
      done(error);
    }
  };
};

export const getSessionId = ({
  cookies,
  headers,
}: FastifyRequest): string | undefined => {
  return cookies.session || (headers.session as string);
};

export const checkCodes = (codes?: string | string[]): string[] | undefined => {
  if (codes) {
    let list: string[] = [];

    if (typeof codes === "string") {
      list = codes.split(",");
    } else {
      list = codes;
    }

    const invalid = list.reduce<string[]>((arr, code) => {
      if (!isoCodes.getByCountryCode(code)) {
        arr.push(code);
      }

      return arr;
    }, []);

    if (invalid.length) {
      throw new Error(`Invalid codes: ${invalid.join(", ")}`);
    }

    return list
  }
};
