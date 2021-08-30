import { z } from "zod";

export type ScreenshotDetailConfigObject = z.infer<
  typeof ScreenshotDetailConfigObject
>;
export const ScreenshotDetailConfigObject = z.object({
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
});

export type EnantiomInternalConfig = z.infer<typeof EnantiomInternalConfig>;
export const EnantiomInternalConfig = z.object({
  artifactPath: z.string(),
  outDirname: z.string(),
  prevOutDirname: z.string().optional(),
  screenshotDetails: z.array(ScreenshotDetailConfigObject),
});

export type ScreenshotAndDiffResult = z.infer<typeof ScreenshotAndDiffResult>;
export const ScreenshotAndDiffResult = ScreenshotDetailConfigObject.extend({
  filename: z.string(),
  filepath: z.string(),
  prevFilepath: z.string().optional(),
  diffFilepath: z.string().optional(),
  diffResult: z
    .union([
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
    ])
    .optional(),
});

export type MetaFile = z.infer<typeof MetaFile>;
export const MetaFile = z.object({
  last_result: z.string(),
  results: z.array(ScreenshotAndDiffResult),
});
