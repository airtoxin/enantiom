import playwright from "playwright";
import { EnantiomInternalConfig, ScreenshotDetailConfigObject } from "./types";
import { join } from "path";

export type ScreenshotResult = {
  readonly detail: ScreenshotDetailConfigObject;
  readonly screenshotFileName: string;
};

export const takeScreenshots = async (
  config: EnantiomInternalConfig
): Promise<ScreenshotResult[]> => {
  return Promise.all(
    config.screenshotDetails.map<Promise<ScreenshotResult>>(async (detail) => {
      const browser = await playwright[detail.browser].launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(detail.url);

      const fileName = `${detail.url}-${detail.browser}.png`
        .replace(new RegExp(":", "g"), "__")
        .replace(new RegExp("/", "g"), "__");
      const screenshotFilePath = join("public", config.outDirname, fileName);
      await page.screenshot({
        path: screenshotFilePath,
      });
      await browser.close();

      return {
        detail,
        screenshotFileName: fileName,
      };
    })
  );
};
