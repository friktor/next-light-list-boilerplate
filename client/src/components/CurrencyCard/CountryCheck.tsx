import { useCallback, useState } from "react";
import * as cookies from "cookie";
import clsx from "clsx";

import { CountryWithStatus } from "@/models/country";
import * as api from "@/api";

export function CountryCheck({ enabled, code, name, flag }: CountryWithStatus) {
  const [isEnabled, setEnabled] = useState(enabled);

  const onToggle = useCallback(async () => {
    const { session } = cookies.parse(document.cookie);
    if (!session) return;

    const {
      data: { enabled },
    } = await api.currencies.updateStatus(code, !isEnabled);

    setEnabled(enabled);
  }, [code, isEnabled]);

  return (
    <button
      className={clsx(
        "px-3 py-2 font-semibold transition-colors focus:relative cursor-pointer text-sm rounded-xl",
        {
          "bg-zinc-700 hover:bg-zinc-600 text-gray-200 hover:text-gray-300": !isEnabled,
          "bg-green-700 hover:bg-green-600 text-white hover:text-white-700": isEnabled,
        }
      )}
      onClick={onToggle}
      type="button"
    >
      {flag} {name}
    </button>
  );
}
