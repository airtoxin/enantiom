import { parse } from "ts-command-line-args";
import { join } from "path";
import { spawn as cspawn } from "child_process";
import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { ScreenshotService } from "./ScreenshotService";
import { StateFileService } from "./StateFileService";
import { copy } from "fs-extra";

export type EnantiomCliArgument = {
  config: string;
};

const args = parse<EnantiomCliArgument>({
  config: { type: String, alias: "c" },
});

const OUTPUT_DIRNAME = join("public", "assets");

const main = async () => {
  const stateFileService = new StateFileService(OUTPUT_DIRNAME);
  const state = await stateFileService.load();
  const configService = new EnantiomConfigLoader(args.config, state);
  const config = await configService.load();

  // sync previous output
  try {
    await copy(
      join(process.cwd(), config.artifactPath, "assets"),
      join(process.cwd(), "public", "assets")
    );
  } catch {
    // nothing to do
  }

  const screenshotService = new ScreenshotService(config);
  const result = await screenshotService.takeScreenshotAndDiff(OUTPUT_DIRNAME);

  await stateFileService.appendSave(result);

  const next = join(__dirname, "../node_modules/.bin/next");
  await spawn(next, ["build"]);
  await spawn(next, ["export", "-o", config.artifactPath]);
};

const spawn = (cmd: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const p = cspawn(cmd, args);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on("close", (code) => {
      return code ? reject() : resolve();
    });
  });

main().then(() => process.exit(0));
