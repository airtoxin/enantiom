import { parse } from "ts-command-line-args";
import { takeScreenshots } from "./screenshot";
import { parseConfig } from "./configParser";
import { MetaFileService } from "./MetaFileService";
import { compare } from "odiff-bin";
import { join } from "path";
import fs from "fs/promises";

export type EnantiomCliArgument = {
  "artifact-path": string;
  url: string[];
};

const args = parse<EnantiomCliArgument>({
  "artifact-path": { type: String, alias: "a" },
  url: { type: String, multiple: true, alias: "u" },
});

const main = async () => {
  const config = parseConfig(args);
  const metaFileService = new MetaFileService(config);
  const screenshotResults = await takeScreenshots(config);
  const lastMetaFile = await metaFileService.load();
  console.log("@lastMetaFile", lastMetaFile);
  if (lastMetaFile != null) {
    await fs.mkdir(
      join(
        config.artifactPath,
        `${lastMetaFile.lastResultDirName}_${config.distDirName}`
      )
    );
    await Promise.all(
      screenshotResults.map(async (screenshotResult) => {
        const lastFilePath = join(
          config.artifactPath,
          lastMetaFile.lastResultDirName,
          screenshotResult.screenshotFileName
        );
        const latestFilePath = join(
          config.artifactPath,
          config.distDirName,
          screenshotResult.screenshotFileName
        );
        const diffPath = join(
          config.artifactPath,
          `${lastMetaFile.lastResultDirName}_${config.distDirName}`,
          screenshotResult.screenshotFileName
        );
        const result = await compare(lastFilePath, latestFilePath, diffPath, {
          outputDiffMask: true,
        });
        console.log("@result", result);
      })
    );
  }
  await metaFileService.save();
};

main().then(() => process.exit(0));
