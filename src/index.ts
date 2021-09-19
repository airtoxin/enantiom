#!/usr/bin/env node

import { handleRunCommand, exec } from "./cliCommand";
import pAny from "p-any";
import { runHandler } from "./handlers/runHandler";
import { logger } from "./Logger";

const main = async (): Promise<number> => {
  const handlers = pAny([handleRunCommand(runHandler)]);
  exec();

  return handlers;
};

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
