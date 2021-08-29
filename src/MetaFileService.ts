import { EnantiomInternalConfig } from "./types";
import { z } from "zod";
import fs from "fs/promises";
import { join } from "path";

type MetaFile = z.infer<typeof MetaFile>;
const MetaFile = z.object({
  last_result: z.string(),
});

export class MetaFileService {
  constructor(private readonly config: EnantiomInternalConfig) {}
  private readonly prevMetaFilePath = join(
    this.config.artifactPath,
    "meta.json"
  );
  private readonly metaFilePath = join("public", "meta.json");

  public async save() {
    const metaFile: MetaFile = {
      last_result: this.config.outDirname,
    };

    await fs.writeFile(this.metaFilePath, JSON.stringify(metaFile, null, 2), {
      encoding: "utf8",
    });
  }

  public async load(
    {
      prev = false,
    }: {
      prev: boolean;
    } = { prev: false }
  ): Promise<MetaFile | null> {
    const raw = await fs
      .readFile(prev ? this.prevMetaFilePath : this.metaFilePath, {
        encoding: "utf8",
      })
      .catch(() => null);
    if (raw == null) return null;
    const json = JSON.parse(raw);
    return MetaFile.parse(json);
  }
}
