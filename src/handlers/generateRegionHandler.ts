import { GenerateRegionCommandOptions } from "../EnantiomCli";
import { getOpaqueRegions } from "../getOpaqueRegions";
import { logger } from "../Logger";

export const generateRegionHandler = async (
  commandOptions: GenerateRegionCommandOptions
): Promise<number> => {
  logger.debug(`CLI option`, commandOptions);
  const opaqueRegions = await getOpaqueRegions(commandOptions.diffFile);
  console.log(JSON.stringify(opaqueRegions));
  return 0;
};
