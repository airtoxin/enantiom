import { z } from "zod";

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
    browser: z.union([
      z.literal("chromium"),
      z.literal("firefox"),
      z.literal("webkit"),
    ]),
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
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
          z.object({ match: z.literal(true) }),
          z.object({
            match: z.literal(false),
            reason: z.literal("layout-diff"),
          }),
          z.object({
            match: z.literal(false),
            reason: z.literal("pixel-diff"),
            diffCount: z.number(),
            diffPercentage: z.number(),
          }),
        ]),
      })
      .optional(),
  })
);
