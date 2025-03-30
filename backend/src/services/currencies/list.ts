import { Repository } from "typeorm";

import { CurrencyWithStatus, PAGE_ITEMS_LIMIT } from "../../dto";
import { getCountriesStatus } from "../countries";
import { Country } from "../../entity/Country";
import { isoCodes } from "../../utils";

interface GetCurrenciesOptions {
  sessionId: string;
  page?: number;
}

const { assign } = Object;

export async function getCurrencies(
  repo: Repository<Country>,
  { sessionId, page }: GetCurrenciesOptions
): Promise<CurrencyWithStatus[]> {
  const paginate = page ? { page, limit: PAGE_ITEMS_LIMIT } : undefined;
  const currencies = isoCodes.getCurrencies(paginate);
  let status: Record<string, boolean> = {};

  if (sessionId) {
    const countries = currencies.reduce((out, { countries }) => {
      out.push(...countries);
      return out;
    }, []);

    status = await getCountriesStatus(repo, sessionId, countries);
  }

  return currencies.map((currency) =>
    assign({}, currency, {
      countries: currency.countries.map((country) =>
        assign({}, isoCodes.getByCountryCode(country), {
          enabled: !!status[country],
        })
      ),
    })
  );
}
