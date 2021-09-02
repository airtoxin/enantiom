import playwright from "playwright";
import { join } from "path";
import { Result, ScreenshotResult } from "./State";
import objectHash from "object-hash";
import mkdirp from "mkdirp";
import { EnantiomInternalConfig } from "./EnantiomConfig";
import { access, ensureDir } from "fs-extra";
import { compare } from "odiff-bin";

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

        const hash = objectHash(screenshotConfig);
        const filename = `${hash}.png`;
        const dirname = join(outDirPath, this.config.currentTimestamp);
        await mkdirp(dirname);
        const filepath = join(dirname, filename);

        await page.screenshot({
          path: filepath,
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
          await access(prevFilepath);
        } catch {
          return result;
        }

        const currentFilePath = result.filepath;

        const diffFileHash = objectHash({
          currentTimestamp: this.config.currentTimestamp,
          prevTimestamp: this.config.prevTimestamp,
          config: result.config,
        });
        const diffFilename = `${diffFileHash}.png`;
        const diffDirPath = join(outDirPath, this.config.currentTimestamp);
        await ensureDir(diffDirPath);

        const diff = await compare(
          join(process.cwd(), prevFilepath),
          join(process.cwd(), currentFilePath),
          join(process.cwd(), diffDirPath, diffFilename),
          {
            outputDiffMask: true,
          }
        );

        if (diff.match) return result;

        return {
          ...result,
          prevFilepath,
          diff: {
            diffFilepath: join(diffDirPath, diffFilename),
            result: diff,
          },
        };
      })
    );
  }
}
