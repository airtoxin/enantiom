import { EnantiomInternalConfig } from "./types";
import { z } from "zod";
import fs from "fs/promises";
import { join } from "path";

type MetaFile = z.infer<typeof MetaFile>;
const MetaFile = z.object({
  lastResultDirName: z.string(),
});

export class MetaFileService {
  constructor(private readonly config: EnantiomInternalConfig) {}
  private readonly metaFilePath = join(this.config.artifactPath, "meta.json");

  public async save() {
    const metaFile: MetaFile = {
      lastResultDirName: this.config.distDirName,
    };

    await fs.writeFile(this.metaFilePath, JSON.stringify(metaFile, null, 2), {
      encoding: "utf8",
    });
  }

  public async load(): Promise<MetaFile | null> {
    const raw = await fs
      .readFile(this.metaFilePath, { encoding: "utf8" })
      .catch(() => null);
    if (raw == null) return null;
    const json = JSON.parse(raw);
    return MetaFile.parse(json);
  }
}
