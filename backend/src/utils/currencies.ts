import { CountryData, all } from "country-codes-list";

export class Currencies {
  public indexes: Record<string, number>
  public countries: CountryData[]
  public codes: string[] = []

  constructor() {
    this.countries = all();

    this.indexes = this.countries.reduce<Record<string, number>>(
      (map, country, index) => {
        map[country.countryCode] = index;
        this.codes.push(country.countryCode);
        return map;
      },
      {}
    )
  }

  public getByCode = (code: string) => this.countries[this.indexes[code]];

  public getSlice = (page = 1, limit = 10) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return this.countries.slice(start, end);
  }
}

export const isoCodes = new Currencies();