import { z, ZodTypeAny } from "zod";

const arrayOrValue = <T extends ZodTypeAny>(t: T) => z.union([t, z.array(t)]);

export type EnantiomConfig = z.infer<typeof EnantiomConfig>;
export const EnantiomConfig = z.lazy(() =>
  z.object({
    artifact_path: z.string(),
    base_path: z.string().optional(),
    browsers: arrayOrValue(
      z.union([SupportedBrowser, BrowserConfigObject])
    ).optional(),
    sizes: arrayOrValue(BrowserSize).optional(),
    screenshots: z.array(z.union([z.string(), ScreenshotConfigObject])),
    concurrency: z.number().optional(),
    retry: z.number().optional(),
    diff_options: z.object({}).passthrough().optional(),
    scripting: ScriptingConfigObject.optional(),
  })
);

export type SupportedBrowser = z.infer<typeof SupportedBrowser>;
export const SupportedBrowser = z.lazy(() =>
  z.union([z.literal("chromium"), z.literal("firefox"), z.literal("webkit")])
);

export type BrowserConfigObject = z.infer<typeof BrowserConfigObject>;
export const BrowserConfigObject = z.lazy(() =>
  z.object({
    browser: SupportedBrowser,
    sizes: arrayOrValue(BrowserSize).optional(),
  })
);

export type BrowserSize = z.infer<typeof BrowserSize>;
export const BrowserSize = z.lazy(() =>
  z.object({
    width: z.number(),
    height: z.number(),
  })
);

export type ScreenshotConfigObject = z.infer<typeof ScreenshotConfigObject>;
export const ScreenshotConfigObject = z.lazy(() =>
  z.object({
    url: z.string(),
    browsers: arrayOrValue(
      z.union([SupportedBrowser, BrowserConfigObject])
    ).optional(),
    sizes: arrayOrValue(BrowserSize).optional(),
    diff_options: z.object({}).passthrough().optional(),
    scripting: ScriptingConfigObject.optional(),
  })
);

export type ScriptingConfigObject = z.infer<typeof ScriptingConfigObject>;
export const ScriptingConfigObject = z.lazy(() =>
  z.object({
    context_scripts: arrayOrValue(z.string()).optional(),
    pre_scripts: arrayOrValue(z.string()).optional(),
    post_scripts: arrayOrValue(z.string()).optional(),
  })
);
