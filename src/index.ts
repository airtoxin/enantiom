#!/usr/bin/env node

import { handleRunCommand, exec } from "./args";
import pAny from "p-any";
import { runHandler } from "./handlers/runHandler";

const main = async (): Promise<number> => {
  const handlers = pAny([handleRunCommand(runHandler)]);
  exec();

  return handlers;
};

main().then((code) => process.exit(code));
