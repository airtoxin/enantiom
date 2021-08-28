import { join } from "path";
import { EnantiomCliArgument } from "./index";
import { EnantiomInternalConfig } from "./types";
import { format } from "date-fns";

export const parseConfig = (
  args: EnantiomCliArgument
): EnantiomInternalConfig => {
  const distDirName = format(new Date(), "yyyy-MM-dd-HH-mm-ss-SSS");
  return {
    artifactPath: args["artifact-path"],
    distDirName,
    distDirPath: join(args["artifact-path"], distDirName),
    urls:
      args.url?.map((url) => ({
        url,
        browser: "chromium",
      })) || [],
  };
};
