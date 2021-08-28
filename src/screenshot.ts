import playwright from "playwright";
import {
  EnantiomInternalConfig,
  EnantiomScreenshotUrlInternalConfigObject,
} from "./types";
import { join } from "path";

export type ScreenshotResult = {
  readonly urlConfig: EnantiomScreenshotUrlInternalConfigObject;
  readonly screenshotFileName: string;
};

export const takeScreenshots = async (
  config: EnantiomInternalConfig
): Promise<ScreenshotResult[]> => {
  const result = await Promise.all(
    config.urls.map<Promise<ScreenshotResult>>(async (urlConfig) => {
      const browser = await playwright[urlConfig.browser].launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(urlConfig.url);
      const fileName = `${urlConfig.url}-${urlConfig.browser}.png`
        .replace(new RegExp(":", "g"), "__")
        .replace(new RegExp("/", "g"), "__");
      const screenshotFilePath = join(config.distDirPath, fileName);
      await page.screenshot({
        path: screenshotFilePath,
      });
      await browser.close();

      return {
        urlConfig,
        screenshotFileName: fileName,
      };
    })
  );
  return result;
};
