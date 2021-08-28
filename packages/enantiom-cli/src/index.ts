import { parse } from "ts-command-line-args";

interface EnantiomCliArgument {
  "artifact-path"?: string;
  config?: string;
}

export const args = parse<EnantiomCliArgument>({
  "artifact-path": { type: String, optional: true, alias: "a" },
  config: { type: String, optional: true, alias: "c" },
});

console.log("@args", args);
