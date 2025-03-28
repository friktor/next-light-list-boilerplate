import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";

import type { CurrenciesResponse } from "@/models/currency";
import { CurrencyCard } from "@/components/CurrencyCard";
import { getStatus } from "@/api/currencies";
import { pageFromSegments } from "@/utils";

type Props = CurrenciesResponse & { session?: string };

export const getServerSideProps = (async ({ params, req, res }) => {
  let page = pageFromSegments(params?.segments);

  const headers: any = Object.assign(
    {},
    req.headers.cookie && {
      Cookie: req.headers.cookie,
    }
  );

  const [response, session, cookies] = await fetch(
    `${process.env.API_URL}/api/currency?page=${page}&all=true`,
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

export default function ListPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [status, setStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!props.session && props.data.length) {
      const codes = props.data.map(({ countryCode }) => countryCode);

      getStatus(codes, { autoSession: true })
        .then((response) => setStatus(response.data))
        .catch((error) => console.error(error));
    }
  }, [props.session, props.data]);

  const cards = props.data.map(({ enabled, ...currency }, index) => (
    <CurrencyCard
      key={`${currency.currencyCode}-${currency.countryCode}-${index}`}
      enabled={enabled || status?.[currency.countryCode]}
      {...currency}
    />
  ));

  return (
    <div className="min-h-screen p-8 gap-16 sm:p-20">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        {cards}
      </div>

      <div className="flex justify-center mt-10">
        <span className="inline-flex divide-x divide-zinc-100 overflow-hidden rounded-xl bg-white">
          {props.meta.page > 1 && (
            <Link
              className="px-6 py-2 text font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 hover:text-gray-700 focus:relative"
              href={`/list/${props.meta.page - 1}`}
            >
              Prev
            </Link>
          )}

          <Link
            className="px-6 py-2 text font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 hover:text-gray-700 focus:relative"
            href={`/list/${props.meta.page + 1}`}
          >
            Next
          </Link>
        </span>
      </div>
    </div>
  );
}
