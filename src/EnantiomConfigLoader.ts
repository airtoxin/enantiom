import { z } from "zod";
import { readFile } from "fs/promises";
import { EnantiomConfig, ScreenshotConfigObject } from "./EnantiomConfig";
import { EnantiomInternalScriptConfig, ScreenshotConfig, State } from "./State";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";
import { logger } from "./Logger";
import { parseScriptType, ScriptFunc, ScriptType } from "./ScriptStringParser";

const DEFAULT_BROWSER = "chromium";
const DEFAULT_SIZE = { width: 800, height: 600 };
const DEFAULT_CONCURRENCY = 1;
const DEFAULT_RETRY = 0;
const DEFAULT_DIFF_OPTIONS = {
  outputDiffMask: true,
};
const DEFAULT_TIMEOUT = 30 * 1000;

export class EnantiomConfigLoader {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(
    private readonly projectPath: string,
    private readonly configPath: string
  ) {
    logger.debug(
      `Initialize EnantiomConfigLoader with projectPath:${projectPath} configPath:${configPath}`
    );
  }

  public async loadRaw(): Promise<EnantiomConfig> {
    logger.debug(`Load raw config file from ${this.configPath}`);
    const raw = await readFile(this.configPath, {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));
    return this.config;
  }

  public async load(state: State): Promise<EnantiomInternalConfig> {
    logger.debug(
      `Load config file as EnantiomInternalConfig ${this.configPath}`
    );
    const raw = await readFile(this.configPath, {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));

    return {
      projectPath: this.projectPath,
      artifactPath: this.config.artifact_path,
      basePath: this.config.base_path ?? "",
      currentTimestamp: `${Date.now()}`,
      screenshotConfigs: this.createScreenshotConfigs(),
      prevTimestamp: state.results[0]?.timestamp,
      concurrency: this.config.concurrency ?? DEFAULT_CONCURRENCY,
      retry: this.config.retry ?? DEFAULT_RETRY,
    };
  }

  private createScreenshotConfigs(): ScreenshotConfig[] {
    logger.debug(`Prepares ScreenshotConfigs`);
    return this.config.screenshots.flatMap((screenshot) => {
      const url = typeof screenshot === "string" ? screenshot : screenshot.url;
      const name = typeof screenshot === "string" ? undefined : screenshot.name;
      const screenshotBrowserConfig =
        typeof screenshot === "string" ? null : screenshot.browsers;
      const screenshotSizeConfig =
        typeof screenshot === "string" ? null : screenshot.sizes;
      const diffOptions =
        typeof screenshot === "string"
          ? this.config.diff_options ?? DEFAULT_DIFF_OPTIONS
          : screenshot.diff_options ??
            this.config.diff_options ??
            DEFAULT_DIFF_OPTIONS;
      const scripts = this.createScriptsConfig(screenshot);
      const timeout =
        typeof screenshot === "string"
          ? this.config.timeout ?? DEFAULT_TIMEOUT
          : screenshot.timeout ?? this.config.timeout ?? DEFAULT_TIMEOUT;

      return [
        screenshotBrowserConfig ?? this.config.browsers ?? DEFAULT_BROWSER,
      ]
        .flat()
        .flatMap((browser): ScreenshotConfig[] => {
          if (typeof browser === "string") {
            return [screenshotSizeConfig ?? this.config.sizes ?? DEFAULT_SIZE]
              .flat()
              .map((size) => {
                const conf = {
                  url,
                  name,
                  browser,
                  size,
                  scripts,
                  diffOptions,
                  timeout,
                };
                logger.debug(`Screenshot`, screenshot, `configures to`, conf);
                return conf;
              });
          } else {
            return [
              browser.sizes ??
                screenshotSizeConfig ??
                this.config.sizes ??
                DEFAULT_SIZE,
            ]
              .flat()
              .map((size) => {
                const conf = {
                  url,
                  name,
                  browser: browser.browser,
                  size,
                  scripts,
                  diffOptions,
                  timeout,
                };
                logger.debug(`Screenshot`, screenshot, `configures to`, conf);
                return conf;
              });
          }
        });
    });
  }

  private createScriptsConfig(
    screenshotConfig: ScreenshotConfigObject | string
  ): EnantiomInternalScriptConfig | undefined {
    if (
      // no screenshot config (fallback to config.scripting)
      typeof screenshotConfig === "string" ||
      screenshotConfig == null ||
      screenshotConfig.scripting == null
    ) {
      return this.config.scripting == null
        ? undefined
        : {
            contextScripts: this.createContextScripts(
              this.config.scripting.context_scripts
            ),
            preScripts: this.createPreScripts(
              this.config.scripting?.pre_scripts
            ),
            postScripts: this.createPostScripts(
              this.config.scripting?.post_scripts
            ),
          };
    } else {
      const contextScripts =
        screenshotConfig.scripting.context_scripts == null &&
        this.config.scripting != null
          ? this.createContextScripts(this.config.scripting.context_scripts)
          : this.createContextScripts(
              screenshotConfig.scripting.context_scripts
            );
      const preScripts =
        screenshotConfig.scripting.pre_scripts == null &&
        this.config.scripting != null
          ? this.createPreScripts(this.config.scripting.pre_scripts)
          : this.createPreScripts(screenshotConfig.scripting.pre_scripts);
      const postScripts =
        screenshotConfig.scripting.post_scripts == null &&
        this.config.scripting != null
          ? this.createPostScripts(this.config.scripting.post_scripts)
          : this.createPostScripts(screenshotConfig.scripting.post_scripts);

      return {
        contextScripts,
        preScripts,
        postScripts,
      };
    }
  }

  private createContextScripts(
    contextScriptsConfig?: string | ScriptFunc | (string | ScriptFunc)[]
  ): ScriptType[] | undefined {
    if (contextScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.context_scripts == null
      )
        return undefined;
      return [this.config.scripting.context_scripts]
        .flat()
        .map(parseScriptType);
    } else {
      return [contextScriptsConfig].flat().map(parseScriptType);
    }
  }

  private createPreScripts(
    preScriptsConfig?: string | ScriptFunc | (string | ScriptFunc)[]
  ): ScriptType[] | undefined {
    if (preScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.pre_scripts == null
      )
        return undefined;
      return [this.config.scripting.pre_scripts].flat().map(parseScriptType);
    } else {
      return [preScriptsConfig].flat().map(parseScriptType);
    }
  }

  private createPostScripts(
    postScriptsConfig?: string | ScriptFunc | (string | ScriptFunc)[]
  ): ScriptType[] | undefined {
    if (postScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.post_scripts == null
      )
        return undefined;
      return [this.config.scripting.post_scripts].flat().map(parseScriptType);
    } else {
      return [postScriptsConfig].flat().map(parseScriptType);
    }
  }
}
