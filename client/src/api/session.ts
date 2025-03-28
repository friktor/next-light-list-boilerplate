import { v4 as uuidv4 } from "uuid";
import * as cookies from "cookie";

export interface SessionOptions {
  autoSession?: boolean;
  session?: string;
}

export const getSession = (options?: SessionOptions) =>
  (global?.document?.cookie && cookies.parse(document.cookie).session) ||
  options?.session ||
  (options?.autoSession && uuidv4());
