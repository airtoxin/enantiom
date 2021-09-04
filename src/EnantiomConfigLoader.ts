import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { EnantiomConfig, EnantiomInternalConfig } from "./EnantiomConfig";
import { ScreenshotConfig, State } from "./State";

export class EnantiomConfigLoader {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(private configPath: string) {}

  public async loadRaw(): Promise<EnantiomConfig> {
    const raw = await readFile(join(process.cwd(), this.configPath), {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));
    return this.config;
  }

  public async load(state: State): Promise<EnantiomInternalConfig> {
    const raw = await readFile(join(process.cwd(), this.configPath), {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));

    return {
      artifactPath: this.config.artifact_path,
      currentTimestamp: `${Date.now()}`,
      screenshotConfigs: this.createScreenshotConfigs(),
      prevTimestamp: state.results[0]?.timestamp,
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
