import { DefaultResponseDto, PaginationMeta } from "./common";

export interface Currency {
    enabled: boolean
    code: string
    id: string
}

export type EnrichedCurrency = Omit<Currency, "id" | "code"> & {
  countryNameEn: string;
  countryNameLocal: string;
  countryCode: string;
  currencyCode: string;
  currencyNameEn: string;
  tinType: string;
  tinName: string;
  officialLanguageCode: string;
  officialLanguageNameEn: string;
  officialLanguageNameLocal: string;
  countryCallingCode: string;
  areaCodes?: any[];
  region: string;
  flag: string;
} 

export type CurrenciesResponse = DefaultResponseDto<EnrichedCurrency[], PaginationMeta>;

export interface CurrenciesQueryParams {
  all: boolean
}

export type CurrenciesMapResponse = DefaultResponseDto<Record<string, boolean>>;
export type UpdateCurrencyStatusResponse = DefaultResponseDto<Currency>;
