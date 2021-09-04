import { z } from "zod";

export type EnantiomConfig = z.infer<typeof EnantiomConfig>;
export const EnantiomConfig = z.lazy(() =>
  z.object({
    artifact_path: z.string(),
    browsers: z // "chromium" | ["chromium"]
      .union([EnantiomSupportedBrowser, z.array(EnantiomSupportedBrowser)])
      .optional(),
    screenshots: z.array(z.string()), // URL[]
  })
);

export type EnantiomSupportedBrowser = z.infer<typeof EnantiomSupportedBrowser>;
export const EnantiomSupportedBrowser = z.union([
  z.literal("chromium"),
  z.literal("firefox"),
  z.literal("webkit"),
]);
