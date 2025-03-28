import { useCallback, useState } from "react";
import * as cookies from "cookie";
import Flag from "react-flagpack";
import clsx from "clsx";

import { EnrichedCurrency } from "@/models/currency";
import * as api from "@/api";
import Check from "./check.svg";

export function CurrencyCard({
  countryCode,
  enabled,
  ...rest
}: EnrichedCurrency) {
  const [isEnabled, setEnabled] = useState(enabled);

  const onToggle = useCallback(async () => {
    const { session } = cookies.parse(document.cookie);
    if (!session) return;

    const {
      data: { enabled },
    } = await api.currencies.updateStatus(countryCode, !isEnabled);

    setEnabled(enabled);
  }, [countryCode, isEnabled]);

  const fields = {
    code: countryCode,
    currency: rest.currencyCode,
    phone: rest.countryCallingCode,
    region: rest.region,
    emoji: rest.flag,
  };

  const details = Object.entries(fields).map(([key, value]) => (
    <div key={key} className="py-2 px-4 flex items-center justify-between">
      <div className="font-semibold uppercase text-sm text-zinc-200">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </div>
      <div className="font-regular text-zinc-100 text-sm">{value}</div>
    </div>
  ));

  return (
    <div className="py-6 flex flex-col rounded-3xl bg-zinc-800">
      <div className="flex flex-col justify-center items-center px-4">
        <Flag
          code={countryCode}
          size="l"
          className="h-6 border-none overflow-hidden rounded shadow-gray-500"
        />
        <h4 className="my-2 font-regular text-xl text-center text-zinc-50">
          {rest.countryNameEn}
        </h4>
      </div>

      <div className="mt-4 flex flex-col">{details}</div>

      <div className="flex justify-center mt-6">
        <button
          className={clsx(
            "px-6 py-2 font-semibold transition-colors focus:relative cursor-pointer rounded-xl",
            {
              "bg-zinc-700 hover:bg-zinc-600 hover:text-gray-700": !isEnabled,
              "bg-green-700 hover:bg-green-600 hover:text-white-700": isEnabled,
            }
          )}
          onClick={onToggle}
          type="button"
        >
          <Check className="text-white" />
        </button>
      </div>
    </div>
  );
}
