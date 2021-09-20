import { GenerateRegionCommandOptions } from "../EnantiomCli";
import { getOpaqueRegions } from "../sharp";

export const generateRegionHandler = async (
  commandOptions: GenerateRegionCommandOptions
): Promise<number> => {
  console.log("@commandOptions", commandOptions);
  const opaqueRegions = await getOpaqueRegions("../../a.png");
  console.log("@opaqueRegions", opaqueRegions);
  return 0;
};
