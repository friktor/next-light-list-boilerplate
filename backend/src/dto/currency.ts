import { CountryData } from "country-codes-list";
import Joi from "joi";

import { DefaultResponseDto, PaginationMeta } from "./common";
import { Currency } from "../entity/Currency";
import { isoCodes } from "../utils";

export type EnrichedCurrency = Omit<Currency, "id" | "code"> & CountryData;

export interface UpdateCurrencyStatusDto {
  enabled: boolean;
  code: string;
}

export const updateCurrencyStatusDto = Joi.object<UpdateCurrencyStatusDto>({
  code: Joi.string().valid(...isoCodes.codes),
  enabled: Joi.bool().required(),
});

export type CurrenciesResponse = DefaultResponseDto<
  EnrichedCurrency[],
  PaginationMeta
>;

export interface CurrenciesQueryParams {
  all: boolean;
}

export interface CurrenciesStatusQueryParams {
  codes?: string | string[];
}

export type CurrenciesStatusResponse = DefaultResponseDto<
  Record<string, boolean>,
  { codes?: string[] }
>;
export type UpdateCurrencyStatusResponse = DefaultResponseDto<Currency>;
