#!/usr/bin/env node

import { handleRunCommand, exec } from "./cliCommand";
import pAny from "p-any";
import { runHandler } from "./handlers/runHandler";
import { logger } from "./Logger";
import sharp from "sharp";
import { seq } from "./utils";

const main = async (): Promise<number> => {
  const opaqueRegions = await sharp("a.png")
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const regions: { x1: number; y1: number; x2: number; y2: number }[] = [];
      let size = 0;
      for (const y of seq(info.height)) {
        for (const x of seq(info.width)) {
          if (data[(y * info.width + x) * 4 + 3] !== 0) {
            size += 1;
          } else if (size !== 0) {
            regions.push({ x1: x - size, y1: y, x2: x, y2: y + 1 });
            size = 0;
          }
        }
        if (size !== 0) {
          regions.push({
            x1: info.width - size,
            y1: y,
            x2: info.width,
            y2: y + 1,
          });
          size = 0;
        }
      }
      return regions;
    });
  console.log("@opaqueRegions", opaqueRegions);

  process.exit(0);
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
