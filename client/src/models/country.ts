import { DefaultResponseDto, PaginationMeta } from "./common";

export interface CountryMinimal {
  enabled: boolean
  code: string
  id: string
}

export interface CurrencyData {
  countries: string[];
  code: string;
  name: string;
}

export interface CountryData {
  currency: string;
  code: string;

  region: string;
  phone: string;
  name: string;
  flag: string;
}

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

export type UpdateCountryStatusResponse = DefaultResponseDto<CountryMinimal>;
