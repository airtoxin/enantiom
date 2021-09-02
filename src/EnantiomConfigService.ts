import { z } from "zod";
import { EnantiomInternalConfig, ScreenshotDetailConfigObject } from "./types";
import { readFile } from "fs/promises";
import { join } from "path";
import { format } from "date-fns";
import { MetaFileService } from "./MetaFileService";
import { EnantiomConfig } from "./EnantiomConfig";

const defaultBrowser = "chromium";
const defaultSize = { width: 800, height: 600 };

export class EnantiomConfigService {
  private config!: z.infer<typeof EnantiomConfig>;
  constructor(private configPath: string) {}

  public async load(): Promise<EnantiomInternalConfig> {
    const raw = await readFile(join(process.cwd(), this.configPath), {
      encoding: "utf-8",
    });
    this.config = EnantiomConfig.parse(JSON.parse(raw));

    const metaFileService = new MetaFileService(this.config.artifact_path);
    const metaFile = await metaFileService.loadPrev();

    return {
      artifactPath: this.config.artifact_path,
      outDirname: format(new Date(), "yyyy-MM-dd-HH-mm-ss-SSS"),
      prevOutDirname: metaFile?.last_result,
      screenshotDetails: this.createScreenshotDetail(),
    };
  }

  private createScreenshotDetail(): ScreenshotDetailConfigObject[] {
    if (typeof this.config.screenshots === "string") {
      return this.makeConfig(this.config.screenshots);
    } else if (!Array.isArray(this.config.screenshots)) {
      // TODO: Respect this.config.screenshots.browsers
      return this.makeConfig(this.config.screenshots.url);
    } else {
      return this.config.screenshots.flatMap((screenshot) => {
        if (typeof screenshot === "string") {
          return this.makeConfig(screenshot);
        } else {
          // TODO: Respect screenshot.browsers
          return this.makeConfig(screenshot.url);
        }
      });
    }
  }

  private makeConfig(url: string): ScreenshotDetailConfigObject[] {
    if (this.config.browsers == null) {
      if (this.config.sizes == null) {
        return [{ url, browser: defaultBrowser, size: defaultSize }];
      } else if (Array.isArray(this.config.sizes)) {
        return this.config.sizes.map((size) => ({
          url,
          browser: defaultBrowser,
          size,
        }));
      } else {
        return [{ url, browser: defaultBrowser, size: this.config.sizes }];
      }
    } else if (typeof this.config.browsers === "string") {
      if (this.config.sizes == null) {
        return [{ url, browser: this.config.browsers, size: defaultSize }];
      } else if (Array.isArray(this.config.sizes)) {
        // HACK: typescript does not infer type correctly in map callback function
        const browser = this.config.browsers;
        return this.config.sizes.map((size) => ({
          url,
          browser,
          size,
        }));
      } else {
        return [
          { url, browser: this.config.browsers, size: this.config.sizes },
        ];
      }
    } else {
      return this.config.browsers.flatMap((browser) => {
        if (typeof browser === "string") {
          if (this.config.sizes == null) {
            return [{ url, browser, size: defaultSize }];
          } else if (Array.isArray(this.config.sizes)) {
            return this.config.sizes.map((size) => ({ url, browser, size }));
          } else {
            return [{ url, browser, size: this.config.sizes }];
          }
        } else {
          if (browser.sizes == null) {
            return [{ url, browser: browser.browser, size: defaultSize }];
          } else if (!Array.isArray(browser.sizes)) {
            return [{ url, browser: browser.browser, size: browser.sizes }];
          } else {
            return browser.sizes.map((size) => ({
              url,
              browser: browser.browser,
              size,
            }));
          }
        }
      });
    }
  }
}
