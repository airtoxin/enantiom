import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { EnantiomConfig, EnantiomInternalConfig } from "./EnantiomConfig";
import { ScreenshotConfig } from "./State";

export class EnantiomConfigService {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(private configPath: string) {}

  public async load(): Promise<EnantiomInternalConfig> {
    const raw = await readFile(join(process.cwd(), this.configPath), {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));

    return {
      artifactPath: this.config.artifact_path,
      currentTimestamp: `${Date.now()}`,
      screenshotConfigs: this.createScreenshotConfigs(),
    };
  }

  private createScreenshotConfigs(): ScreenshotConfig[] {
    return this.config.screenshots.flatMap((url) => {
      return [
        {
          url,
          browser: "chromium",
          size: { width: 800, height: 600 },
        },
      ];
    });
  }
}
