import playwright from "playwright";
import { join, resolve } from "path";
import { Result, ScreenshotResult } from "./State";
import objectHash from "object-hash";
import { access, ensureDir } from "fs-extra";
import { compare } from "odiff-bin";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";
import pLimit from "p-limit";
import pRetry from "p-retry";
import { logger } from "./Logger";

export class ScreenshotService {
  constructor(private config: EnantiomInternalConfig) {
    logger.trace(`Initialize ScreenshotService.`);
  }

  public async takeScreenshotAndDiff(outDirPath: string): Promise<Result> {
    const results = await this.takeScreenshot(outDirPath);
    const screenshots = await this.saveDiff(outDirPath, results);
    return {
      timestamp: this.config.currentTimestamp,
      screenshots,
    };
  }

  private async takeScreenshot(
    outDirPath: string
  ): Promise<ScreenshotResult[]> {
    const limit = pLimit(this.config.concurrency);
    return Promise.all(
      this.config.screenshotConfigs.map((screenshotConfig) =>
        limit(() =>
          pRetry(
            async () => {
              logger.debug(`Taking screenshot with config`, screenshotConfig);

              const browser = await playwright[
                screenshotConfig.browser
              ].launch();
              const context = await browser.newContext();
              const page = await context.newPage();
              await page.setViewportSize(screenshotConfig.size);
              await page.goto(screenshotConfig.url);
              if (screenshotConfig.preScriptPath) {
                logger.debug(
                  `Execute preScript ${resolve(
                    process.cwd(),
                    screenshotConfig.preScriptPath
                  )}`
                );
                const preScript = require(resolve(
                  process.cwd(),
                  screenshotConfig.preScriptPath
                ));
                if (typeof preScript === "function") {
                  await preScript(page, browser, context);
                } else {
                  logger.warn(
                    `Execute preScript was skipped, because preScript is not executable function ${preScript}`
                  );
                }
              }

              const hash = objectHash(screenshotConfig);
              logger.debug(`result hash: ${hash}`);
              const filename = `${hash}.png`;
              const dirname = join(
                this.config.projectPath,
                outDirPath,
                this.config.currentTimestamp
              );
              await ensureDir(dirname);
              const absoluteFilepath = join(dirname, filename);
              const filepath = join(
                outDirPath,
                this.config.currentTimestamp,
                filename
              );

              logger.info(`Saving screenshot to ${absoluteFilepath}`);
              await page.screenshot({
                path: absoluteFilepath,
              });
              await browser.close();
              logger.debug(`Browser closed successfully.`);

              return {
                hash,
                config: screenshotConfig,
                filepath,
              };
            },
            { retries: this.config.retry }
          )
        )
      )
    );
  }

  private async saveDiff(
    outDirPath: string,
    results: ScreenshotResult[]
  ): Promise<ScreenshotResult[]> {
    return Promise.all(
      results.map(async (result) => {
        if (this.config.prevTimestamp == null) {
          logger.info(
            `Calculate image diff step was skipped because previous result was not found`
          );
          return result;
        }

        const prevFilepath = join(
          outDirPath,
          this.config.prevTimestamp,
          `${result.hash}.png`
        );
        logger.debug(`Previous file path: ${prevFilepath}`);
        // Ensure existence of prevFile
        try {
          await access(join(this.config.projectPath, prevFilepath));
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
          outDirPath,
          this.config.currentTimestamp,
          `${diffFileHash}.png`
        );
        logger.debug(`Diff file path: ${diffFilepath}`);

        await ensureDir(
          join(
            this.config.projectPath,
            outDirPath,
            this.config.currentTimestamp
          )
        );
        const diff = await compare(
          join(this.config.projectPath, prevFilepath),
          join(this.config.projectPath, currentFilepath),
          join(this.config.projectPath, diffFilepath),
          {
            outputDiffMask: true,
          }
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
