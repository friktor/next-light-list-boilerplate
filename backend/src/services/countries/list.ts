import { FindManyOptions, Repository } from "typeorm";

import { CountryWithStatus, PAGE_ITEMS_LIMIT } from "../../dto";
import { Country } from "../../entity/Country";
import { getCountriesStatus } from "./status";
import { isoCodes } from "../../utils";

interface GetCountriesOptions {
  sessionId: string;
  includeAll?: boolean;
  page?: number;
}

const { assign } = Object;

export async function getCountriesList(
  repo: Repository<Country>,
  { includeAll, sessionId, page }: GetCountriesOptions
): Promise<CountryWithStatus[]> {
  if (includeAll) {
    const paginate = page ? { page, limit: PAGE_ITEMS_LIMIT } : undefined;
    const countries = isoCodes.getCountries(paginate);
    let status: Record<string, boolean> = {};

    if (sessionId) {
      const codes = countries.map(({ code }) => code);
      status = await getCountriesStatus(repo, sessionId, codes);
    }

    return countries.map((country) =>
      assign({}, country, {
        enabled: !!status[country.code],
      })
    );
  } else {
    const paginate = page
      ? { skip: PAGE_ITEMS_LIMIT * (page - 1), take: PAGE_ITEMS_LIMIT }
      : {};

    const countries = await repo.find(
      assign(
        {
          select: ["code", "enabled"],
          order: { code: "ASC" },
          where: { id: sessionId },
        } as FindManyOptions<Country>,
        paginate
      )
    );

    return countries.map(({ code, enabled }) =>
      Object.assign({}, isoCodes.getByCountryCode(code), { enabled })
    );
  }
}
