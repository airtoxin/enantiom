import { GenerateRegionCommandOptions } from "../EnantiomCli";
import { getOpaqueRegions } from "../getOpaqueRegions";
import { logger } from "../Logger";
import { seq } from "../utils";

export const generateRegionHandler = async (
  commandOptions: GenerateRegionCommandOptions
): Promise<number> => {
  const logLevel = commandOptions.verbose - commandOptions.quiet;
  seq(Math.abs(logLevel)).forEach(() => {
    logLevel < 0 ? logger.setQuiet() : logger.setVerbose();
  });

  logger.debug(`CLI option`, commandOptions);
  const opaqueRegions = await getOpaqueRegions(commandOptions.diffFile);
  console.log(JSON.stringify(opaqueRegions));
  return 0;
};
