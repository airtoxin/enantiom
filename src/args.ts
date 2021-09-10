import { parse } from "ts-command-line-args";

export type EnantiomCliArgument = {
  config: string;
  verbose?: boolean[];
  help?: boolean;
  "no-html"?: boolean;
};

export const args = parse<EnantiomCliArgument>(
  {
    config: { type: String, alias: "c", description: "Path to config file" },
    verbose: {
      type: Boolean,
      alias: "v",
      multiple: true,
      optional: true,
      description: "Output verbose log (allow multiple)",
    },
    "no-html": {
      type: Boolean,
      optional: true,
      description: "Disable HTML report and output JSON only",
    },
    help: {
      type: Boolean,
      optional: true,
      alias: "h",
      description: "Prints this usage guide",
    },
  },
  {
    helpArg: "help",
    headerContentSections: [
      {
        header: "enantiom CLI",
      },
    ],
  }
);
