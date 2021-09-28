import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { EnantiomConfig } from "./EnantiomConfig";

const DEFAULT_BROWSER = "chromium";
const DEFAULT_SIZE = { width: 800, height: 600 };
const DEFAULT_DIFF_OPTIONS = { outputDiffMask: true };
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_FULL_PAGE = false;

const createDefaultContext = () => {
  const loader = new EnantiomConfigLoader(
    "dummy/project",
    "dummy/enantiom.config.json"
  );
  const url = "https://example.com/1";
  const config: EnantiomConfig = {
    artifact_path: "dummy/artifact_path",
    screenshots: [url],
  };
  loader["config"] = config;

  return { loader, config, url };
};

describe("EnantiomConfigLoader", () => {
  describe("createScreenshotConfigs", () => {
    test("url with default browser and default size", () => {
      const { loader, url } = createDefaultContext();
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("multiple urls with default browser and default size", () => {
      const { loader, config, url } = createDefaultContext();
      const url2 = "https://example.com/2";
      config.screenshots = [url, url2];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("url with multiple browsers and default size", () => {
      const { loader, config, url } = createDefaultContext();
      config.browsers = ["webkit", "firefox"];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "webkit",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("url with default browser and multiple sizes", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize1 = { width: 10, height: 10 };
      const customSize2 = { width: 100, height: 100 };
      config.sizes = [customSize1, customSize2];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: DEFAULT_BROWSER,
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("multiple urls with multiple browser and multiple sizes", () => {
      const { loader, config, url } = createDefaultContext();
      const url2 = "https://example.com/2";
      const customSize1 = { width: 10, height: 10 };
      const customSize2 = { width: 100, height: 100 };
      config.screenshots = [url, url2];
      config.browsers = ["webkit", "firefox"];
      config.sizes = [customSize1, customSize2];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("simple browser object config", () => {
      const { loader, config, url } = createDefaultContext();
      config.browsers = [{ browser: "firefox" }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("browser object config with size", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize = { width: 500, height: 500 };
      config.browsers = [{ browser: "firefox", sizes: customSize }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: customSize,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("browser object config with multiple size", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize1 = { width: 500, height: 500 };
      const customSize2 = { width: 1000, height: 1000 };
      config.browsers = [
        { browser: "firefox", sizes: [customSize1, customSize2] },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("mixed browser config", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize1 = { width: 500, height: 500 };
      const customSize2 = { width: 1000, height: 1000 };
      config.browsers = [
        "firefox",
        { browser: "webkit", sizes: [customSize1, customSize2] },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("simple screenshot object config", () => {
      const { loader, config, url } = createDefaultContext();
      config.screenshots = [{ url }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("simple browser config in screenshot object config", () => {
      const { loader, config, url } = createDefaultContext();
      config.screenshots = [{ url, browsers: "firefox" }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("size config in browser object config in screenshot object config", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize = { width: 200, height: 200 };
      config.screenshots = [
        { url, browsers: { browser: "firefox", sizes: customSize } },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: customSize,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("multiple sizes config in multiple browsers object config in screenshot object config", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize1 = { width: 100, height: 100 };
      const customSize2 = { width: 200, height: 200 };
      const customSize3 = { width: 300, height: 300 };
      const customSize4 = { width: 400, height: 400 };
      config.screenshots = [
        {
          url,
          browsers: [
            "chromium",
            { browser: "firefox", sizes: [customSize1, customSize2] },
            { browser: "webkit", sizes: [customSize3, customSize4] },
          ],
        },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "chromium",
          size: DEFAULT_SIZE,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "webkit",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "webkit",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("complex screenshot object config with default config", () => {
      const { loader, config } = createDefaultContext();
      const url1 = "https://example.com/aaaa";
      const url2 = "https://example.com/bbbb";
      const customSize1 = { width: 100, height: 100 };
      const customSize2 = { width: 200, height: 200 };
      const customSize3 = { width: 300, height: 300 };
      const customSize4 = { width: 400, height: 400 };
      const customSize5 = { width: 500, height: 500 };
      config.browsers = [{ browser: "chromium", sizes: customSize1 }];
      config.sizes = [customSize2, customSize3];
      config.screenshots = [
        {
          url: url1,
          browsers: [
            "chromium",
            { browser: "firefox", sizes: [customSize4, customSize5] },
          ],
        },
        {
          url: url2,
          browsers: { browser: "webkit" },
        },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url: url1,
          browser: "chromium",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "chromium",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize5,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    test("screenshot config with mixed browser config and sizes config", () => {
      const { loader, config, url } = createDefaultContext();
      const customSize1 = { width: 100, height: 100 };
      const customSize2 = { width: 200, height: 200 };
      const customSize3 = { width: 300, height: 300 };
      const customSize4 = { width: 400, height: 400 };
      config.screenshots = [
        {
          url,
          browsers: [
            "chromium",
            { browser: "firefox", sizes: [customSize1, customSize2] },
          ],
          sizes: [customSize3, customSize4],
        },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "chromium",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "chromium",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });

    it("complex pattern", () => {
      const { loader, config } = createDefaultContext();
      const url1 = "https://example.com/1";
      const url2 = "https://example.com/2";
      const url3 = "https://example.com/3";
      const url4 = "https://example.com/4";
      const url5 = "https://example.com/5";
      const customSize1 = { width: 100, height: 100 };
      const customSize2 = { width: 200, height: 200 };
      const customSize3 = { width: 300, height: 300 };
      const customSize4 = { width: 400, height: 400 };
      const customSize5 = { width: 500, height: 500 };
      const customSize6 = { width: 600, height: 600 };
      config.browsers = [
        "chromium",
        { browser: "firefox" },
        { browser: "webkit", sizes: [customSize1, customSize2] },
      ];
      config.sizes = [customSize3, customSize4];
      config.screenshots = [
        url1,
        { url: url2 },
        { url: url3, sizes: [customSize5, customSize6] },
        { url: url4, browsers: "webkit" },
        {
          url: url5,
          browsers: [
            "firefox",
            { browser: "webkit", sizes: [customSize5, customSize6] },
          ],
        },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url: url1,
          browser: "chromium",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "chromium",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url1,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "chromium",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "chromium",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "chromium",
          size: customSize5,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "chromium",
          size: customSize6,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "firefox",
          size: customSize5,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "firefox",
          size: customSize6,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "webkit",
          size: customSize1,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url3,
          browser: "webkit",
          size: customSize2,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url4,
          browser: "webkit",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url4,
          browser: "webkit",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url5,
          browser: "firefox",
          size: customSize3,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url5,
          browser: "firefox",
          size: customSize4,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url5,
          browser: "webkit",
          size: customSize5,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
        {
          url: url5,
          browser: "webkit",
          size: customSize6,
          diffOptions: DEFAULT_DIFF_OPTIONS,
          timeout: DEFAULT_TIMEOUT,
          fullPage: DEFAULT_FULL_PAGE,
        },
      ]);
    });
  });
});
