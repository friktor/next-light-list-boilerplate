import { all } from "country-codes-list";

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

interface Context<CC = string[]> {
  currencies: Record<string, CurrencyData>;
  countries: Record<string, CountryData>;

  currenciesToCountries: Record<string, string>;
  countriesToCurrencies: Record<string, string>;
  currencyCodes: CC;
  countryCodes: CC;
}

interface PaginateOptions {
  limit: number;
  page: number;
}

export class Countries implements Context {
  public currenciesToCountries: Record<string, string>;
  public countriesToCurrencies: Record<string, string>;
  public currencies: Record<string, CurrencyData>;
  public countries: Record<string, CountryData>;
  public currencyCodes: string[];
  public countryCodes: string[];

  constructor() {
    const {
      currencyCodes,
      countryCodes,
      ...context
    } = all().reduce<Context<Set<string>>>(
      (out, source) => {
        const { countryCode, currencyCode } = source;

        // @NOTE: may enrich later
        const country = {
          currency: currencyCode,
          code: countryCode,

          phone: source.countryCallingCode,
          name: source.countryNameEn,
          region: source.region,
          flag: source.flag,
        };

        out.countries[country.code] = country;

        if (out.currencies[country.currency]) {
          out.currencies[country.currency].countries.push(country.code);
        } else {
          out.currencies[country.currency] = {
            name: source.currencyNameEn,
            code: country.currency,
            countries: [country.code],
          };
        }

        out.currenciesToCountries[country.currency] = country.code;
        out.countriesToCurrencies[country.code] = currencyCode;

        out.currencyCodes.add(country.currency);
        out.countryCodes.add(country.code);

        return out;
      },
      {
        currenciesToCountries: {},
        countriesToCurrencies: {},
        currencyCodes: new Set(),
        countryCodes: new Set(),
        currencies: {},
        countries: {},
      }
    );

    this.currencyCodes = Array.from(currencyCodes)
    this.countryCodes = Array.from(countryCodes)
    
    Object.assign(this, context);
  }

  public getByCurrencyCode = (iso4217Code: string) =>
    this.countries[iso4217Code];
  public getByCountryCode = (iso3166Code: string) =>
    this.countries[iso3166Code];

  public getCodes = (
    type: "currency" | "country",
    paginate?: PaginateOptions
  ) => {
    let codes: string[] = this[`${type}Codes`];

    if (paginate) {
      const start = paginate.limit * (paginate.page - 1);
      const end = start + paginate.limit;
      codes = codes.slice(start, end);
    }

    return codes;
  };

  public getCountries = (paginate?: PaginateOptions) => {
    let codes = this.getCodes("country", paginate);
    return codes.map((countryCode) => this.countries[countryCode]);
  };

  public getCurrencies = (paginate?: PaginateOptions) => {
    let codes = this.getCodes("currency", paginate);
    return codes.map((currencyCode) => this.currencies[currencyCode]);
  };
}

export const countrySchema = {
  type: "object",
  properties: {
    currency: { type: "string" },
    code: { type: "string" },
    region: { type: "string" },
    phone: { type: "string" },
    name: { type: "string" },
    flag: { type: "string" },
  },
};

export const currencySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    code: { type: "string" },
    countries: {
      type: "array",
      items: countrySchema,
    },
  },
};

export const isoCodes = new Countries();
