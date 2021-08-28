import { parse } from "ts-command-line-args";
import { takeScreenshots } from "./screenshot";
import { parseConfig } from "./configParser";

export type EnantiomCliArgument = {
  url?: string[];
};

const args = parse<EnantiomCliArgument>({
  url: { type: String, optional: true, multiple: true, alias: "u" },
});

const main = async () => {
  const config = parseConfig(args);
  await takeScreenshots(config.urls);
};

main().then(() => process.exit(0));
