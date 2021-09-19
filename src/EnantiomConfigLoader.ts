import { z } from "zod";
import { readFile } from "fs/promises";
import { EnantiomConfig, ScreenshotConfigObject } from "./EnantiomConfig";
import {
  EnantiomInternalScriptConfig,
  LoadStateEvent,
  ScreenshotConfig,
  ScriptType,
  State,
} from "./State";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";
import { logger } from "./Logger";

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
    logger.trace(
      `Initialize EnantiomConfigLoader with projectPath:${projectPath} configPath:${configPath}`
    );
  }

  public async loadRaw(): Promise<EnantiomConfig> {
    logger.debug(`Load raw config file ${this.configPath}`);
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
    logger.debug(`Expand screenshot configurations to ScreenshotConfig[]`);
    return this.config.screenshots.flatMap((screenshot, i) => {
      logger.debug(`Processing config.screenshots[${i}]`);
      logger.trace(screenshot);

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
              .map((size) => ({
                url,
                name,
                browser,
                size,
                scripts,
                diffOptions,
                timeout,
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
                name,
                browser: browser.browser,
                size,
                scripts,
                diffOptions,
                timeout,
              }));
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
    contextScriptsConfig?: string | string[]
  ): ScriptType[] | undefined {
    if (contextScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.context_scripts == null
      )
        return undefined;
      return [this.config.scripting.context_scripts]
        .flat()
        .map(this.parseScriptTypeString);
    } else {
      return [contextScriptsConfig].flat().map(this.parseScriptTypeString);
    }
  }

  private createPreScripts(
    preScriptsConfig?: string | string[]
  ): ScriptType[] | undefined {
    if (preScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.pre_scripts == null
      )
        return undefined;
      return [this.config.scripting.pre_scripts]
        .flat()
        .map(this.parseScriptTypeString);
    } else {
      return [preScriptsConfig].flat().map(this.parseScriptTypeString);
    }
  }

  private createPostScripts(
    postScriptsConfig?: string | string[]
  ): ScriptType[] | undefined {
    if (postScriptsConfig == null) {
      if (
        this.config.scripting == null ||
        this.config.scripting.post_scripts == null
      )
        return undefined;
      return [this.config.scripting.post_scripts]
        .flat()
        .map(this.parseScriptTypeString);
    } else {
      return [postScriptsConfig].flat().map(this.parseScriptTypeString);
    }
  }

  private parseScriptTypeString(str: string): ScriptType {
    if (str.startsWith("[exec-file]=")) {
      return { type: "scriptFile", path: str.slice("[exec-file]=".length) };
    } else if (str.startsWith("[set-timeout]=")) {
      return {
        type: "setTimeout",
        timeout: Number.parseFloat(str.slice("[set-timeout]=".length)),
      };
    } else if (str.startsWith("[wait-timeout]=")) {
      return {
        type: "waitForTimeout",
        timeout: Number.parseFloat(str.slice("[wait-timeout]=".length)),
      };
    } else if (str.startsWith("[wait-selector]=")) {
      return {
        type: "waitForSelector",
        selector: str.slice("[wait-selector]=".length),
      };
    } else if (str.startsWith("[wait-url]=")) {
      return {
        type: "waitForUrl",
        url: str.slice("[wait-url]=".length),
      };
    } else if (str.startsWith("[wait-request]=")) {
      return {
        type: "waitForRequest",
        url: str.slice("[wait-request]=".length),
      };
    } else if (str.startsWith("[wait-response]=")) {
      return {
        type: "waitForResponse",
        url: str.slice("[wait-response]=".length),
      };
    } else if (str.startsWith("[wait-navigation]=")) {
      return {
        type: "waitForNavigation",
        url: str.slice("[wait-navigation]=".length),
      };
    } else if (str.startsWith("[wait-state]=")) {
      return {
        type: "waitForLoadState",
        event: LoadStateEvent.parse(str.slice("[wait-state]=".length)),
      };
    } else if (str.startsWith("[wait-event]=")) {
      return { type: "waitForEvent", event: str.slice("[wait-event]=".length) };
    } else if (str.startsWith("[click]=")) {
      return { type: "click", selector: str.slice("[click]=".length) };
    } else if (str.startsWith("[dblclick]=")) {
      return { type: "dblclick", selector: str.slice("[dblclick]=".length) };
    }

    throw new Error(`Unsupported script string: ${str}.`);
  }
}
