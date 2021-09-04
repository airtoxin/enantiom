import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { EnantiomConfig } from "./EnantiomConfig";

const DEFAULT_BROWSER = "chromium";
const DEFAULT_SIZE = { width: 800, height: 600 };

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
        },
        {
          url: url2,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
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
        },
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
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
        },
        {
          url,
          browser: DEFAULT_BROWSER,
          size: customSize2,
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
        },
        {
          url,
          browser: "webkit",
          size: customSize2,
        },
        {
          url,
          browser: "firefox",
          size: customSize1,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize1,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize2,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize1,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize2,
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
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
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
        },
        {
          url,
          browser: "webkit",
          size: customSize1,
        },
        {
          url,
          browser: "webkit",
          size: customSize2,
        },
      ]);
    });

    test("simple screenshot object config", () => {
      const { loader, config } = createDefaultContext();
      const url = "https://example.com/aaaa";
      config.screenshots = [{ url }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
        },
      ]);
    });

    test("simple browser config in screenshot object config", () => {
      const { loader, config } = createDefaultContext();
      const url = "https://example.com/aaaa";
      config.screenshots = [{ url, browsers: "firefox" }];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
        },
      ]);
    });

    test("size config in browser object config in screenshot object config", () => {
      const { loader, config } = createDefaultContext();
      const url = "https://example.com/aaaa";
      const customSize = { width: 200, height: 200 };
      config.screenshots = [
        { url, browsers: { browser: "firefox", sizes: customSize } },
      ];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: "firefox",
          size: customSize,
        },
      ]);
    });

    test("multiple sizes config in multiple browsers object config in screenshot object config", () => {
      const { loader, config } = createDefaultContext();
      const url = "https://example.com/aaaa";
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
        },
        {
          url,
          browser: "firefox",
          size: customSize1,
        },
        {
          url,
          browser: "firefox",
          size: customSize2,
        },
        {
          url,
          browser: "webkit",
          size: customSize3,
        },
        {
          url,
          browser: "webkit",
          size: customSize4,
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
        },
        {
          url: url1,
          browser: "chromium",
          size: customSize3,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize4,
        },
        {
          url: url1,
          browser: "firefox",
          size: customSize5,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize2,
        },
        {
          url: url2,
          browser: "webkit",
          size: customSize3,
        },
      ]);
    });
  });
});
