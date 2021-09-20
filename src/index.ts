#!/usr/bin/env node

import { EnantiomCli } from "./EnantiomCli";
import { runHandler } from "./handlers/runHandler";
import { logger } from "./Logger";
import { generateRegionHandler } from "./handlers/generateRegionHandler";

new EnantiomCli({
  run: runHandler,
  generateRegion: generateRegionHandler,
})
  .execute(process.argv)
  .then(process.exit)
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
