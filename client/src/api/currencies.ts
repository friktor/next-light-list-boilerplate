import { getSession, SessionOptions } from "./session";

import {
  UpdateCurrencyStatusResponse,
  CurrenciesMapResponse,
} from "@/models/currency";

export async function updateStatus(
  code: string,
  enabled: boolean,
  options?: SessionOptions
): Promise<UpdateCurrencyStatusResponse> {
  let session = getSession(options);

  const headers: any = Object.assign(
    {
      "Content-Type": "application/json",
    },
    session && { session }
  );

  const body = JSON.stringify({
    enabled,
    code,
  });

  const res = await fetch(`${document.location.origin}/api/currency/status`, {
    credentials: "omit",
    method: "PATCH",
    headers,
    body,
  });

  return res.json();
}

export async function getStatus(
  codes?: string[],
  options?: SessionOptions
): Promise<CurrenciesMapResponse> {
  let session = getSession(options);

  const headers: any = Object.assign(
    {
      "Content-Type": "application/json",
    },
    session && { session }
  );

  const query = codes ? `?codes=${codes.join(",")}` : "";

  const res = await fetch(
    `${document.location.origin}/api/currency/status${query}`,
    {
      credentials: "include",
      method: "GET",
      headers,
    }
  );

  return res.json();
}
