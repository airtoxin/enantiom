import { GenerateRegionCommandOptions } from "../EnantiomCli";
import { getOpaqueRegions } from "../getOpaqueRegions";

export const generateRegionHandler = async (
  commandOptions: GenerateRegionCommandOptions
): Promise<number> => {
  const opaqueRegions = await getOpaqueRegions(commandOptions.diffFile);
  console.log(JSON.stringify(opaqueRegions));
  return 0;
};
