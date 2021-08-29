import { parse } from "ts-command-line-args";
import { MetaFileService } from "./MetaFileService";
import { join } from "path";
import { spawn as cspawn } from "child_process";
import { EnantiomConfigService } from "./EnantiomConfigService";
import { ScreenshotService } from "./ScreenshotService";

export type EnantiomCliArgument = {
  config: string;
};

const args = parse<EnantiomCliArgument>({
  config: { type: String, alias: "c" },
});

const main = async () => {
  const configService = new EnantiomConfigService(args.config);
  const config = await configService.load();
  const metaFileService = new MetaFileService(config.artifactPath);
  const screenshotService = new ScreenshotService(config);
  const results = await screenshotService.takeScreenshotAndDiff();
  await metaFileService.save(config.outDirname, results);

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
