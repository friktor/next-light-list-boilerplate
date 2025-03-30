import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

import type { CountriesResponse } from "@/models/country";
import { CountryCard } from "@/components/CountryCard";
import { getStatus } from "@/api/currencies";
import { pageFromSegments } from "@/utils";

type Props = CountriesResponse & { session?: string };

export const getServerSideProps = (async ({ params, req, res }) => {
  let page = pageFromSegments(params?.segments);

  const headers: any = Object.assign(
    {},
    req.headers.cookie && {
      Cookie: req.headers.cookie,
    }
  );

  const [response, session, cookies] = await fetch(
    `${process.env.API_URL}/api/countries?page=${page}&all=true`,
    {
      method: "GET",
      headers,
    }
  ).then((res) =>
    Promise.all([
      res.json(),
      Promise.resolve(res.headers.get("session")),
      res.headers.getSetCookie().join(" ; "),
    ])
  );

  session && res.setHeader("session", session);
  res.setHeader("Set-Cookie", cookies);

  const props: Props = Object.assign(response, session && { session });
  return { props };
}) satisfies GetServerSideProps<Props>;

export default function Countries({
  session,
  data,
  meta: { page },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [status, setStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session && data.length) {
      const codes = data.map(({ code }) => code);

      getStatus(codes, { autoSession: true })
        .then((response) => setStatus(response.data))
        .catch((error) => console.error(error));
    }
  }, [session, data]);

  const cards = data.map(({ enabled, ...country }, index) => (
    <CountryCard
      key={`${country.currency}-${country.code}-${index}`}
      enabled={enabled || status?.[country.code]}
      {...country}
    />
  ));

  return (
    <div className="min-h-screen p-8 sm:p-20 gap-8 flex flex-col">
      <h2 className="font-bold text-white text-2xl text-center">
        Countries • Page {page}
      </h2>

      <Head>
        <title>Countries • Page {page}</title>
      </Head>

      <div className="flex justify-between items-center">
        <Link
          className="px-4 py-2 rounded-xl text-sm text-center font-semibold text-zinc-900 transition-colors bg-white hover:bg-zinc-200 hover:text-gray-700 focus:relative"
          href={`/`}
        >
          Home
        </Link>
        <Link
          className="px-4 py-2 rounded-xl text-sm text-center font-semibold text-zinc-900 transition-colors bg-white hover:bg-zinc-200 hover:text-gray-700 focus:relative"
          href={`/currencies`}
        >
          Currencies
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-8">
        {cards}
      </div>

      <div className="flex justify-center mt-10">
        <span className="inline-flex divide-x divide-zinc-100 overflow-hidden rounded-xl bg-white">
          {page > 1 && (
            <Link
              className="px-6 py-2 text font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 hover:text-gray-700 focus:relative"
              href={`/countries/${page - 1}`}
            >
              Prev
            </Link>
          )}

          <Link
            className="px-6 py-2 text font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 hover:text-gray-700 focus:relative"
            href={`/countries/${page + 1}`}
          >
            Next
          </Link>
        </span>
      </div>
    </div>
  );
}
