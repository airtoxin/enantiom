import { z } from "zod";

export type SizeConfig = z.infer<typeof SizeConfig>;
export const SizeConfig = z.object({
  width: z.number(),
  height: z.number(),
});

export type SizesConfigValue = z.infer<typeof SizesConfigValue>;
export const SizesConfigValue = z
  .union([SizeConfig, z.array(SizeConfig)])
  .optional();

export type SupportedBrowserName = z.infer<typeof SupportedBrowserName>;
export const SupportedBrowserName = z.union([
  z.literal("chromium"),
  z.literal("firefox"),
  z.literal("webkit"),
]);

export type BrowserConfig = z.infer<typeof BrowserConfig>;
export const BrowserConfig = z.object({
  browser: SupportedBrowserName,
  sizes: SizesConfigValue,
});

export type BrowsersConfigValue = z.infer<typeof BrowsersConfigValue>;
export const BrowsersConfigValue = z
  .union([
    SupportedBrowserName,
    z.array(SupportedBrowserName),
    z.array(z.union([SupportedBrowserName, BrowserConfig])),
  ])
  .optional();

export type ScreenshotConfig = z.infer<typeof ScreenshotConfig>;
export const ScreenshotConfig = z.object({
  url: z.string(),
  browsers: BrowsersConfigValue,
});

export type ScreenshotConfigValue = z.infer<typeof ScreenshotConfigValue>;
export const ScreenshotConfigValue = z.union([
  z.string(),
  ScreenshotConfig,
  z.array(z.union([z.string(), ScreenshotConfig])),
]);

export type EnantiomConfig = z.infer<typeof EnantiomConfig>;
export const EnantiomConfig = z.object({
  artifact_path: z.string(),
  browsers: BrowsersConfigValue,
  sizes: SizesConfigValue,
  screenshots: ScreenshotConfigValue,
});
