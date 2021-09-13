import { z } from "zod";
import { ScreenshotConfig } from "./State";

export type EnantiomInternalConfig = z.infer<typeof EnantiomInternalConfig>;
export const EnantiomInternalConfig = z.lazy(() =>
  z.object({
    projectPath: z.string(),
    artifactPath: z.string(),
    basePath: z.string(),
    currentTimestamp: z.string(),
    prevTimestamp: z.string().optional(),
    screenshotConfigs: z.array(ScreenshotConfig),
    concurrency: z.number(),
    retry: z.number(),
  })
);
