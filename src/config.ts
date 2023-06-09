import { CorsOptions } from "cors";
import matchUrl from "match-url-wildcard";

export const isProduction = process.env.NODE_ENV === "production";
export const WHITELIST = process.env.WHITELIST as string;
const whitelist = WHITELIST.split(",");

export const corsOptions: CorsOptions = {
  credentials: true,
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ): void => {
    if (!requestOrigin || matchUrl(requestOrigin, whitelist)) {
      callback(null, true);
    } else {
      callback(new Error(`${requestOrigin} Not allowed by CORS`));
    }
  },
};
