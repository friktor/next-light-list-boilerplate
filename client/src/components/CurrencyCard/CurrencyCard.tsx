import { CurrencyWithStatus } from "@/models/country";
import { CountryCheck } from "./CountryCheck";

export function CurrencyCard({ countries, name, code }: CurrencyWithStatus) {
  const fields = {
    code,
  };

  const details = Object.entries(fields).map(([key, value]) => (
    <div key={key} className="py-2 flex items-center justify-between">
      <div className="font-semibold uppercase text-sm text-zinc-200">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </div>
      <div className="font-regular text-zinc-100 text-sm">{value}</div>
    </div>
  ));

  const checks = countries.map((country, index) => (
    <CountryCheck key={`${code}-${country}-${index}`} {...country} />
  ));

  return (
    <div className="py-6 px-6 flex flex-col rounded-3xl bg-zinc-800">
      <div className="flex flex-col">
        <h4 className="font-regular text-xl text-left text-zinc-50">
          {name}
        </h4>
      </div>

      <div className="mt-4 flex flex-col max-w-2xs">{details}</div>
      <div className="flex flex-wrap mt-6 gap-2">{checks}</div>
    </div>
  );
}
