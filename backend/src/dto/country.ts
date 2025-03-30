import Joi from "joi";

import { DefaultResponseDto, PaginationMeta } from "./common";
import { CountryData, CurrencyData, isoCodes } from "../utils";
import { Country } from "../entity/Country";

export interface CountryWithStatus extends CountryData {
  enabled: boolean;
}

export interface CurrencyWithStatus extends Omit<CurrencyData, "countries"> {
  countries: CountryWithStatus[];
}

export interface UpdateCountryStatusDto {
  enabled: boolean;
  code: string;
}

export const updateCountryStatusDto = Joi.object<UpdateCountryStatusDto>({
  code: Joi.string().valid(...isoCodes.countryCodes),
  enabled: Joi.bool().required(),
});

export type CountriesResponse = DefaultResponseDto<
  CountryWithStatus[],
  PaginationMeta
>;

export type CurrenciesResponse = DefaultResponseDto<
  CurrencyWithStatus[],
  PaginationMeta
>;

export interface CountriesQueryParams {
  all: boolean;
}

export interface CountriesStatusQueryParams {
  codes?: string | string[];
}

export type CountriesStatusResponse = DefaultResponseDto<
  Record<string, boolean>,
  { codes?: string[] }
>;

export type UpdateCountryStatusResponse = DefaultResponseDto<Country>;
