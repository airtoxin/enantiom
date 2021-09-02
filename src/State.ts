import { z } from "zod";

export type State = z.infer<typeof State>;
export const State = z.object({
  stateVersion: z.literal("1"),
  results: z.array(
    z.object({
      timestamp: z.string(),
      screenshots: z.array(
        z.object({
          hash: z.string(),
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
      ),
    })
  ),
});
