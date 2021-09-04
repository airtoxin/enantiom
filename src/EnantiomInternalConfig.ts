import { z } from "zod";
import { ScreenshotConfig } from "./State";

export type EnantiomInternalConfig = z.infer<typeof EnantiomInternalConfig>;
export const EnantiomInternalConfig = z.object({
  projectPath: z.string(),
  artifactPath: z.string(),
  currentTimestamp: z.string(),
  prevTimestamp: z.string().optional(),
  screenshotConfigs: z.array(ScreenshotConfig),
});
