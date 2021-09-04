import { z } from "zod";
import { readFile } from "fs/promises";
import { EnantiomConfig } from "./EnantiomConfig";
import { ScreenshotConfig, State } from "./State";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";

const DEFAULT_BROWSER = "chromium";
const DEFAULT_SIZE = { width: 800, height: 600 };

export class EnantiomConfigLoader {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(
    private readonly projectPath: string,
    private readonly configPath: string
  ) {}

  public async loadRaw(): Promise<EnantiomConfig> {
    const raw = await readFile(this.configPath, {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));
    return this.config;
  }

  public async load(state: State): Promise<EnantiomInternalConfig> {
    const raw = await readFile(this.configPath, {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));

    return {
      projectPath: this.projectPath,
      artifactPath: this.config.artifact_path,
      currentTimestamp: `${Date.now()}`,
      screenshotConfigs: this.createScreenshotConfigs(),
      prevTimestamp: state.results[0]?.timestamp,
    };
  }

  private createScreenshotConfigs(): ScreenshotConfig[] {
    return this.config.screenshots.flatMap((screenshot) => {
      const url = typeof screenshot === "string" ? screenshot : screenshot.url;
      const screenshotBrowserConfig =
        typeof screenshot === "string" ? null : screenshot.browsers;
      const screenshotSizeConfig =
        typeof screenshot === "string" ? null : screenshot.sizes;

      return [
        screenshotBrowserConfig ?? this.config.browsers ?? DEFAULT_BROWSER,
      ]
        .flat()
        .flatMap((browser) => {
          if (typeof browser === "string") {
            return [screenshotSizeConfig ?? this.config.sizes ?? DEFAULT_SIZE]
              .flat()
              .map((size) => ({
                url,
                browser,
                size,
              }));
          } else {
            return [
              browser.sizes ??
                screenshotSizeConfig ??
                this.config.sizes ??
                DEFAULT_SIZE,
            ]
              .flat()
              .map((size) => ({
                url,
                browser: browser.browser,
                size,
              }));
          }
        });
    });
  }
}
