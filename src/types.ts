export type EnantiomInternalConfig = {
  readonly artifactPath: string;
  readonly distDirName: string;
  readonly distDirPath: string;
  readonly urls: EnantiomScreenshotUrlInternalConfigObject[];
};

export type EnantiomScreenshotUrlInternalConfigObject = {
  readonly url: string;
  readonly browser: "chromium" | "firefox" | "webkit";
};
