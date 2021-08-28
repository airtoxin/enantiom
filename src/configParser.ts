import { EnantiomCliArgument } from "./index";
import { EnantiomInternalConfig } from "./types";

export const parseConfig = (
  args: EnantiomCliArgument
): EnantiomInternalConfig => {
  return {
    urls:
      args.url?.map((url) => ({
        url,
        browser: "chromium",
      })) || [],
  };
};
