import playwright from "playwright";
import { join, resolve } from "path";
import { Result, ScreenshotResult } from "./State";
import objectHash from "object-hash";
import { access, ensureDir } from "fs-extra";
import { compare } from "odiff-bin";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";

export class ScreenshotService {
  constructor(private config: EnantiomInternalConfig) {}

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
    return Promise.all(
      this.config.screenshotConfigs.map(async (screenshotConfig) => {
        const browser = await playwright[screenshotConfig.browser].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.setViewportSize(screenshotConfig.size);
        await page.goto(screenshotConfig.url);
        if (screenshotConfig.preScriptPath) {
          const preScript = require(resolve(
            process.cwd(),
            screenshotConfig.preScriptPath
          ));
          if (typeof preScript === "function") {
            await preScript(page, browser, context);
          }
        }

        const hash = objectHash(screenshotConfig);
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

        await page.screenshot({
          path: absoluteFilepath,
        });
        await browser.close();

        return {
          hash,
          config: screenshotConfig,
          filepath,
        };
      })
    );
  }

  private async saveDiff(
    outDirPath: string,
    results: ScreenshotResult[]
  ): Promise<ScreenshotResult[]> {
    return Promise.all(
      results.map(async (result) => {
        if (this.config.prevTimestamp == null) return result;

        const prevFilepath = join(
          outDirPath,
          this.config.prevTimestamp,
          `${result.hash}.png`
        );
        // Ensure existence of prevFile
        try {
          await access(join(this.config.projectPath, prevFilepath));
        } catch {
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
