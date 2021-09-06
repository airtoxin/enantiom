import { z } from "zod";
import { readFile } from "fs/promises";
import { EnantiomConfig } from "./EnantiomConfig";
import { ScreenshotConfig, State } from "./State";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";
import { logger } from "./Logger";

const DEFAULT_BROWSER = "chromium";
const DEFAULT_SIZE = { width: 800, height: 600 };
const DEFAULT_CONCURRENCY = 1;
const DEFAULT_RETRY = 0;

export class EnantiomConfigLoader {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(
    private readonly projectPath: string,
    private readonly configPath: string
  ) {
    logger.trace(
      `Initialize EnantiomConfigLoader with projectPath:${projectPath} configPath:${configPath}`
    );
  }

  public async loadRaw(): Promise<EnantiomConfig> {
    logger.trace(`Load raw config file ${this.configPath}`);
    const raw = await readFile(this.configPath, {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));
    return this.config;
  }

  public async load(state: State): Promise<EnantiomInternalConfig> {
    logger.trace(
      `Load config file as EnantiomInternalConfig ${this.configPath}`
    );
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
      concurrency: this.config.concurrency ?? DEFAULT_CONCURRENCY,
      retry: this.config.retry ?? DEFAULT_RETRY,
    };
  }

  private createScreenshotConfigs(): ScreenshotConfig[] {
    logger.trace(`Expand screenshot configurations to ScreenshotConfig[]`);
    return this.config.screenshots.flatMap((screenshot, i) => {
      logger.trace(`Processing config.screenshots[${i}]`);

      const url = typeof screenshot === "string" ? screenshot : screenshot.url;
      const screenshotBrowserConfig =
        typeof screenshot === "string" ? null : screenshot.browsers;
      const screenshotSizeConfig =
        typeof screenshot === "string" ? null : screenshot.sizes;
      const preScriptPath = this.config.pre_script_path;

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
                preScriptPath,
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
                preScriptPath,
              }));
          }
        });
    });
  }
}
