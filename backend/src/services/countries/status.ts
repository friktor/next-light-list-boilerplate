import { In, Repository } from "typeorm";

import { Country } from "../../entity/Country";

interface UpdateCountryOptions {
  sessionId: string;
  enabled: boolean;
  code: string;
}

export async function updateCountryStatus(
  repo: Repository<Country>,
  { code, enabled, sessionId }: UpdateCountryOptions
) {
  const country = Country.create(code, enabled, sessionId);

  await repo.upsert(country, {
    upsertType: "on-conflict-do-update",
    skipUpdateIfNoValuesChanged: true,
    conflictPaths: ["id", "code"],
  });

  return country;
}

export async function getCountriesStatus(
  repo: Repository<Country>,
  sessionId: string,
  codes?: string[]
) {
  const countries = await repo.find({
    where: Object.assign({ id: sessionId }, codes && { code: In(codes) }),
    select: ["code", "enabled"],
  });

  return countries.reduce<Record<string, boolean>>(
    (status, { code, enabled }) => {
      status[code] = enabled;
      return status;
    },
    {}
  );
}
