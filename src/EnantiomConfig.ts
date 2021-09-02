import { z } from "zod";
import { State } from "./State";

export type EnantiomConfig = z.infer<typeof EnantiomConfig>;
export const EnantiomConfig = z.lazy(() =>
  z.object({
    artifact_path: z.string(),
    screenshots: z.array(z.string()), // URL[]
  })
);

export type EnantiomInternalConfig = z.infer<typeof EnantiomInternalConfig>;
export const EnantiomInternalConfig = z.object({
  artifactPath: z.string(),
  currentTimestamp: z.string(),
  prevTimestamp: z.string().optional(),
  state: State,
});
