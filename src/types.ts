export type EnantiomInternalConfig = {
  readonly urls: EnantiomScreenshotUrlInternalConfigObject[];
};

export type EnantiomScreenshotUrlInternalConfigObject = {
  readonly url: string;
  readonly browser: "chromium" | "firefox" | "webkit";
};
