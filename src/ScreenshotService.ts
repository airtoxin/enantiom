import playwright from "playwright";
import { join } from "path";
import { Result, ScreenshotResult } from "./State";
import objectHash from "object-hash";
import mkdirp from "mkdirp";
import { EnantiomInternalConfig } from "./EnantiomConfig";

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
    _outDirPath: string,
    results: ScreenshotResult[]
  ): Promise<ScreenshotResult[]> {
    return Promise.all(
      results.map(async (result) => {
        if (this.config.prevTimestamp == null) return result;
        // TODO
        return result;

        // const prevFilePath = join(outDirPath, prevOutDirname, result.filename);
        // const currentFilePath = result.filepath;
        //
        // const diffDirName = `${prevOutDirname}_${outDirname}`;
        // const diffFilepath = join(outDirPath, diffDirName, result.filename);
        // mkdir(join(outDirPath, diffDirName)).catch();
        //
        // const diffResult = await compare(
        //   prevFilePath,
        //   currentFilePath,
        //   diffFilepath,
        //   {
        //     outputDiffMask: true,
        //   }
        // );
        //
        // if (diffResult.match) return result;
        //
        // return {
        //   ...result,
        //   diffFilepath,
        //   diffResult,
        // };
      })
    );
  }
}
