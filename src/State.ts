import { z } from "zod";
import { SupportedBrowser } from "./EnantiomConfig";

export type State = z.infer<typeof State>;
export const State = z.lazy(() =>
  z.object({
    stateVersion: z.literal("1"),
    results: z.array(Result),
  })
);

export type Result = z.infer<typeof Result>;
export const Result = z.lazy(() =>
  z.object({
    timestamp: z.string(),
    screenshots: z.array(ScreenshotResult),
  })
);

export type ScreenshotConfig = z.infer<typeof ScreenshotConfig>;
export const ScreenshotConfig = z.lazy(() =>
  z.object({
    url: z.string(),
    browser: SupportedBrowser,
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
    preScriptPath: z.string().optional(),
  })
);

export type ScreenshotResult = z.infer<typeof ScreenshotResult>;
export const ScreenshotResult = z.lazy(() =>
  z.object({
    hash: z.string(),
    config: ScreenshotConfig,
    filepath: z.string(),
    prevFilepath: z.string().optional(),
    diff: z
      .object({
        diffFilepath: z.string(),
        result: z.union([
          z.object({
            reason: z.literal("layout-diff"),
          }),
          z.object({
            reason: z.literal("pixel-diff"),
            diffCount: z.number(),
            diffPercentage: z.number(),
          }),
        ]),
      })
      .optional(),
  })
);
