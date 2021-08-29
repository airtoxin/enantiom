import { parse } from "ts-command-line-args";
import { takeScreenshots } from "./screenshot";
import { MetaFileService } from "./MetaFileService";
import { compare } from "odiff-bin";
import { join } from "path";
import fs from "fs/promises";
import { spawn as cspawn } from "child_process";
import { EnantiomConfigService } from "./EnantiomConfigService";

export type EnantiomCliArgument = {
  config: string;
};

const args = parse<EnantiomCliArgument>({
  config: { type: String, alias: "c" },
});

const main = async () => {
  const configService = new EnantiomConfigService(args.config);
  const config = await configService.load();
  const metaFileService = new MetaFileService(config);
  const screenshotResults = await takeScreenshots(config);
  const lastMetaFile = await metaFileService.load({ prev: true });
  console.log("@lastMetaFile", lastMetaFile);
  if (lastMetaFile != null) {
    await fs.mkdir(
      join("public", `${lastMetaFile.last_result}_${config.outDirname}`)
    );
    await Promise.all(
      screenshotResults.map(async (screenshotResult) => {
        const lastFilePath = join(
          "public",
          lastMetaFile.last_result,
          screenshotResult.screenshotFileName
        );
        const currentFilePath = join(
          "public",
          config.outDirname,
          screenshotResult.screenshotFileName
        );
        const diffPath = join(
          "public",
          `${lastMetaFile.last_result}_${config.outDirname}`,
          screenshotResult.screenshotFileName
        );
        const result = await compare(lastFilePath, currentFilePath, diffPath, {
          outputDiffMask: true,
        });
        console.log("@result", result);
      })
    );
  }
  await metaFileService.save();

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
