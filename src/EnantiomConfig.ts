import { z, ZodTypeAny } from "zod";

const arrayOrValue = <T extends ZodTypeAny>(t: T) => z.union([t, z.array(t)]);

export type EnantiomConfig = z.infer<typeof EnantiomConfig>;
export const EnantiomConfig = z.lazy(() =>
  z.object({
    artifact_path: z.string(),
    browsers: arrayOrValue(EnantiomSupportedBrowser).optional(),
    sizes: arrayOrValue(BrowserSize).optional(),
    screenshots: z.array(z.string()),
  })
);

export type EnantiomSupportedBrowser = z.infer<typeof EnantiomSupportedBrowser>;
export const EnantiomSupportedBrowser = z.union([
  z.literal("chromium"),
  z.literal("firefox"),
  z.literal("webkit"),
]);

export type BrowserSize = z.infer<typeof BrowserSize>;
export const BrowserSize = z.object({
  width: z.number(),
  height: z.number(),
});
