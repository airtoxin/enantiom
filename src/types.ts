export type EnantiomInternalConfig = {
  readonly artifactPath: string;
  readonly outDirname: string;
  readonly prevOutDirname?: string;
  readonly screenshotDetails: ScreenshotDetailConfigObject[];
};

export type ScreenshotDetailConfigObject = {
  readonly url: string;
  readonly browser: "chromium" | "firefox" | "webkit";
  readonly size: { width: number; height: number };
};
