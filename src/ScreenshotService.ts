import playwright, { Browser, BrowserContext, Page } from "playwright";
import { join, resolve } from "path";
import { Result, ScreenshotResult, ScriptType } from "./State";
import objectHash from "object-hash";
import { access, ensureDir } from "fs-extra";
import { compare } from "odiff-bin";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";
import pLimit from "p-limit";
import pRetry from "p-retry";
import { logger } from "./Logger";

export class ScreenshotService {
  constructor(private config: EnantiomInternalConfig) {
    logger.debug(`Initialize ScreenshotService.`);
  }

  public async takeScreenshotAndDiff(): Promise<Result> {
    const results = await this.takeScreenshot();
    const screenshots = await this.saveDiff(results);
    return {
      timestamp: this.config.currentTimestamp,
      screenshots,
    };
  }

  private async takeScreenshot(): Promise<ScreenshotResult[]> {
    const limit = pLimit(this.config.concurrency);
    return Promise.all(
      this.config.screenshotConfigs.map((screenshotConfig) =>
        limit(() =>
          pRetry(
            async () => {
              logger.info(`Taking screenshot with config:`, screenshotConfig);

              const browser = await playwright[
                screenshotConfig.browser
              ].launch();

              try {
                const context = await browser.newContext();
                const page = await context.newPage();
                logger.debug(`Set viewport size to`, screenshotConfig.size);
                await page.setViewportSize(screenshotConfig.size);
                logger.debug(
                  `Set page default timeout milliseconds to ${screenshotConfig.timeout}`
                );
                await page.setDefaultTimeout(screenshotConfig.timeout);

                for (const contextScript of screenshotConfig.scripts
                  ?.contextScripts ?? []) {
                  await executeScript(contextScript, page, browser, context);
                }

                logger.debug(`loading page ${screenshotConfig.url}`);
                await page.goto(screenshotConfig.url);

                for (const preScript of screenshotConfig.scripts?.preScripts ??
                  []) {
                  await executeScript(preScript, page, browser, context);
                }

                const hash = objectHash(screenshotConfig);
                logger.debug(`result hash: ${hash}`);
                const filename = `${hash}.png`;
                const dirname = join(
                  this.config.projectPath,
                  "public",
                  "assets",
                  this.config.currentTimestamp
                );
                await ensureDir(dirname);
                const absoluteFilepath = join(dirname, filename);
                const filepath = join(
                  "assets",
                  this.config.currentTimestamp,
                  filename
                );

                logger.info(`Saving screenshot to ${absoluteFilepath}`);
                await page.screenshot({
                  path: absoluteFilepath,
                });

                for (const postScript of screenshotConfig.scripts
                  ?.postScripts ?? []) {
                  await executeScript(postScript, page, browser, context);
                }

                return {
                  hash,
                  config: screenshotConfig,
                  filepath,
                };
              } finally {
                await browser.close();
                logger.debug(`Browser closed successfully.`);
              }
            },
            {
              retries: this.config.retry,
              onFailedAttempt: (error) => {
                logger.info(error);
              },
            }
          )
        )
      )
    );
  }

  private async saveDiff(
    results: ScreenshotResult[]
  ): Promise<ScreenshotResult[]> {
    return Promise.all(
      results.map(async (result) => {
        if (this.config.prevTimestamp == null) {
          logger.info(
            `Calculating image diff step was skipped because previous result was not found`
          );
          return result;
        }

        const prevFilepath = join(
          "assets",
          this.config.prevTimestamp,
          `${result.hash}.png`
        );
        logger.debug(`Previous file path: ${prevFilepath}`);
        // Ensure existence of prevFile
        try {
          await access(join(this.config.projectPath, "public", prevFilepath));
        } catch {
          logger.warn(
            `Failed to load previous file: ${join(
              this.config.projectPath,
              prevFilepath
            )}`
          );
          return result;
        }

        const currentFilepath = result.filepath;

        const diffFileHash = objectHash({
          currentTimestamp: this.config.currentTimestamp,
          prevTimestamp: this.config.prevTimestamp,
          config: result.config,
        });
        const diffFilepath = join(
          "assets",
          this.config.currentTimestamp,
          `${diffFileHash}.png`
        );
        logger.debug(`Diff file path: ${diffFilepath}`);

        await ensureDir(
          join(
            this.config.projectPath,
            "public",
            "assets",
            this.config.currentTimestamp
          )
        );
        logger.info(`Calculate diff with options`, result.config.diffOptions);
        const diff = await compare(
          join(this.config.projectPath, "public", prevFilepath),
          join(this.config.projectPath, "public", currentFilepath),
          join(this.config.projectPath, "public", diffFilepath),
          result.config.diffOptions
        );
        logger.info(
          `Image diff result ${prevFilepath} vs ${currentFilepath}`,
          diff
        );

        return diff.match
          ? {
              ...result,
              prevFilepath,
            }
          : {
              ...result,
              prevFilepath,
              diff: {
                diffFilepath,
                result: diff,
              },
            };
      })
    );
  }
}

const executeScript = async (
  scriptConfig: ScriptType,
  page: Page,
  browser: Browser,
  context: BrowserContext
): Promise<unknown> => {
  switch (scriptConfig.type) {
    case "function": {
      logger.debug(`Execute script function.`);
      return scriptConfig.fn(page, browser, context);
    }
    case "scriptFile": {
      const filepath = resolve(process.cwd(), scriptConfig.path);
      const script = require(filepath);
      if (typeof script === "function") {
        logger.debug(`Execute script file ${filepath}`);
        return script(page, browser, context);
      } else {
        return logger.warn(
          `Executing script was skipped, because script file is not executable function ${filepath}`
        );
      }
    }
    case "waitForTimeout": {
      logger.debug(`Waiting for timeout ${scriptConfig.timeout}ms.`);
      return page.waitForTimeout(scriptConfig.timeout);
    }
    case "waitForSelector": {
      logger.debug(`Waiting for selector ${scriptConfig.selector}`);
      return page.waitForSelector(scriptConfig.selector);
    }
    case "waitForUrl": {
      logger.debug(`Waiting for URL ${scriptConfig.url}`);
      return page.waitForURL(scriptConfig.url);
    }
    case "waitForRequest": {
      logger.debug(`Waiting for request ${scriptConfig.url}`);
      return page.waitForRequest(scriptConfig.url);
    }
    case "waitForResponse": {
      logger.debug(`Waiting for response ${scriptConfig.url}`);
      return page.waitForResponse(scriptConfig.url);
    }
    case "waitForNavigation": {
      logger.debug(`Waiting for navigation ${scriptConfig.url}`);
      return page.waitForNavigation({ url: scriptConfig.url });
    }
    case "waitForLoadState": {
      logger.debug(`Waiting for load state ${scriptConfig.event}.`);
      return page.waitForLoadState(scriptConfig.event);
    }
    case "waitForEvent": {
      logger.debug(`Waiting for event ${scriptConfig.event}.`);
      // FIXME: more strict event type
      return page.waitForEvent(scriptConfig.event as any);
    }
    case "setTimeout": {
      logger.debug(`Set timeout milliseconds to ${scriptConfig.timeout}.`);
      return page.setDefaultTimeout(scriptConfig.timeout);
    }
    case "click": {
      logger.debug(`Click ${scriptConfig.selector} element.`);
      return page.click(scriptConfig.selector);
    }
    case "dblclick": {
      logger.debug(`Double-Click ${scriptConfig.selector} element.`);
      return page.dblclick(scriptConfig.selector);
    }
  }
};
