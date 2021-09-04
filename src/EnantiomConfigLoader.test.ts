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
      config.browsers = [DEFAULT_BROWSER, "firefox"];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
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
      const customSize = { width: 100, height: 100 };
      config.sizes = [DEFAULT_SIZE, customSize];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
        },
        {
          url,
          browser: DEFAULT_BROWSER,
          size: customSize,
        },
      ]);
    });

    test("multiple urls with multiple browser and multiple sizes", () => {
      const { loader, config, url } = createDefaultContext();
      const url2 = "https://example.com/2";
      const customSize = { width: 100, height: 100 };
      config.screenshots = [url, url2];
      config.browsers = [DEFAULT_BROWSER, "firefox"];
      config.sizes = [DEFAULT_SIZE, customSize];
      expect(loader["createScreenshotConfigs"]()).toEqual([
        {
          url,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
        },
        {
          url,
          browser: DEFAULT_BROWSER,
          size: customSize,
        },
        {
          url,
          browser: "firefox",
          size: DEFAULT_SIZE,
        },
        {
          url,
          browser: "firefox",
          size: customSize,
        },
        {
          url: url2,
          browser: DEFAULT_BROWSER,
          size: DEFAULT_SIZE,
        },
        {
          url: url2,
          browser: DEFAULT_BROWSER,
          size: customSize,
        },
        {
          url: url2,
          browser: "firefox",
          size: DEFAULT_SIZE,
        },
        {
          url: url2,
          browser: "firefox",
          size: customSize,
        },
      ]);
    });
  });
});
