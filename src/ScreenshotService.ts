import { EnantiomInternalConfig, ScreenshotDetailConfigObject } from "./types";
import playwright from "playwright";
import { join } from "path";
import { compare } from "odiff-bin";
import { PromiseType } from "utility-types";
import { mkdir } from "fs/promises";

export type ScreenshotAndDiffResult = ScreenshotDetailConfigObject & {
  readonly filename: string;
  readonly filepath: string;
  readonly prevFilepath?: string;
  readonly diffFilepath?: string;
  readonly diffResult?: PromiseType<ReturnType<typeof compare>>;
};

export class ScreenshotService {
  constructor(private config: EnantiomInternalConfig) {}

  public async takeScreenshotAndDiff(): Promise<ScreenshotAndDiffResult[]> {
    const screenshots = await this.takeScreenshot();
    return this.saveDiff(screenshots);
  }

  private async takeScreenshot(): Promise<ScreenshotAndDiffResult[]> {
    return Promise.all(
      this.config.screenshotDetails.map(async (detail) => {
        const browser = await playwright[detail.browser].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(detail.url);

        const filename = `${detail.url}-${detail.browser}.png`
          .replace(new RegExp(":", "g"), "__")
          .replace(new RegExp("/", "g"), "__");
        const filepath = join("public", this.config.outDirname, filename);
        await page.screenshot({
          path: filepath,
        });
        await browser.close();

        return {
          ...detail,
          filename,
          filepath,
        };
      })
    );
  }

  private async saveDiff(
    results: ScreenshotAndDiffResult[]
  ): Promise<ScreenshotAndDiffResult[]> {
    return Promise.all(
      results.map(async (result) => {
        if (this.config.prevOutDirname == null) return result;
        const { prevOutDirname, outDirname } = this.config;

        const prevFilePath = join("public", prevOutDirname, result.filename);
        const currentFilePath = result.filepath;

        const diffDirName = `${prevOutDirname}_${outDirname}`;
        const diffFilepath = join("public", diffDirName, result.filename);
        mkdir(join("public", diffDirName)).catch();

        const diffResult = await compare(
          prevFilePath,
          currentFilePath,
          diffFilepath,
          {
            outputDiffMask: true,
          }
        );

        if (diffResult.match) return result;

        return {
          ...result,
          diffFilepath,
          diffResult,
        };
      })
    );
  }
}
