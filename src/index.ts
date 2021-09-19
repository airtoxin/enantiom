#!/usr/bin/env node

import { execRunCommand } from "./cliCommand";
import pAny from "p-any";
import { runHandler } from "./handlers/runHandler";
import { logger } from "./Logger";

pAny([execRunCommand(runHandler)])
  .then((code) => process.exit(code))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
