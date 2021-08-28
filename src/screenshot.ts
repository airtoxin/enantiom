import playwright from "playwright";
import { EnantiomScreenshotUrlInternalConfigObject } from "./types";

export const takeScreenshots = async (
  urlConfigs: EnantiomScreenshotUrlInternalConfigObject[]
) => {
  for (const urlConfig of urlConfigs) {
    const browser = await playwright[urlConfig.browser].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(urlConfig.url);
    await page.screenshot({
      path: `${urlConfig.url}-${urlConfig.browser}.png`,
    });
    await browser.close();
  }
};
