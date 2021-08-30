import { z } from "zod";
import fs from "fs/promises";
import { join } from "path";
import { ScreenshotAndDiffResult } from "./types";

type MetaFile = z.infer<typeof MetaFile>;
const MetaFile = z.object({
  last_result: z.string(),
});

export class MetaFileService {
  constructor(private artifactPath: string) {}
  private readonly prevMetaFilePath = join(this.artifactPath, "meta.json");
  private readonly metaFilePath = join("public", "meta.json");

  public async save(outDirname: string, results: ScreenshotAndDiffResult[]) {
    console.log("@results", results);
    const metaFile: MetaFile = {
      last_result: outDirname,
    };

    await fs.writeFile(this.metaFilePath, JSON.stringify(metaFile, null, 2), {
      encoding: "utf8",
    });
  }

  public async loadPrev(): Promise<MetaFile | null> {
    const raw = await fs
      .readFile(this.prevMetaFilePath, {
        encoding: "utf8",
      })
      .catch(() => null);
    if (raw == null) return null;
    const json = JSON.parse(raw);
    return MetaFile.parse(json);
  }
}
