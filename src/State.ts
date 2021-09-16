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
    name: z.string().optional(),
    browser: SupportedBrowser,
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
    scripts: EnantiomInternalScriptConfig.optional(),
    diffOptions: z.object({}).passthrough(),
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

export type EnantiomInternalScriptConfig = z.infer<
  typeof EnantiomInternalScriptConfig
>;
export const EnantiomInternalScriptConfig = z.lazy(() =>
  z.object({
    contextScripts: z.array(ScriptType).optional(),
    preScripts: z.array(ScriptType).optional(),
    postScripts: z.array(ScriptType).optional(),
  })
);

export type ScriptType = z.infer<typeof ScriptType>;
export const ScriptType = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("function"),
      fn: z.function().args(z.any(), z.any(), z.any()),
    }),
    z.object({ type: z.literal("scriptFile"), path: z.string() }),
    z.object({ type: z.literal("waitForTimeout"), timeout: z.number() }),
    z.object({ type: z.literal("waitForSelector"), selector: z.string() }),
    z.object({ type: z.literal("waitForUrl"), url: z.string() }),
    z.object({ type: z.literal("waitForRequest"), url: z.string() }),
    z.object({ type: z.literal("waitForResponse"), url: z.string() }),
    z.object({ type: z.literal("waitForNavigation"), url: z.string() }),
    z.object({
      type: z.literal("waitForLoadState"),
      event: LoadStateEvent,
    }),
    z.object({ type: z.literal("waitForEvent"), event: z.string() }),
    z.object({ type: z.literal("click"), selector: z.string() }),
    z.object({ type: z.literal("dblclick"), selector: z.string() }),
  ])
);

export type LoadStateEvent = z.infer<typeof LoadStateEvent>;
export const LoadStateEvent = z.lazy(() =>
  z.union([
    z.literal("domcontentloaded"),
    z.literal("load"),
    z.literal("networkidle"),
  ])
);
