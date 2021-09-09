#!/usr/bin/env node

import { join, resolve, sep } from "path";
import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { ScreenshotService } from "./ScreenshotService";
import { StateFileService } from "./StateFileService";
import { logger } from "./Logger";
import { DirectorySyncer } from "./DirectorySyncer";
import { args } from "./args";
import { ReportGenerator } from "./ReportGenerator";

const OUTPUT_DIRNAME = join("public", "assets");

const main = async () => {
  args.verbose?.forEach(() => {
    logger.setVerbose();
  });

  const projectPath = resolve(__dirname, "..");
  logger.info(`enantiom projectPath: ${projectPath}`);

  const configService = new EnantiomConfigLoader(
    projectPath,
    resolve(process.cwd(), args.config)
  );
  const rawConfig = await configService.loadRaw();

  const syncer = new DirectorySyncer();
  await syncer.sync(
    // artifact_path maybe s3://... use join(artifact_path) reduces
    // protocol separator s3://... to s3:/... it breaks syncing logic
    [rawConfig.artifact_path, "assets"].join(sep),
    join(projectPath, "public", "assets")
  );

  const stateFileService = new StateFileService(
    resolve(projectPath, OUTPUT_DIRNAME, "state.json")
  );
  const state = await stateFileService.load();
  const config = await configService.load(state);

  const screenshotService = new ScreenshotService(config);
  const result = await screenshotService.takeScreenshotAndDiff();

  await stateFileService.appendSave(result);

  const reportGenerator = new ReportGenerator(
    projectPath,
    resolve(projectPath, OUTPUT_DIRNAME)
  );

  const reportDirPath = args["no-html"]
    ? await reportGenerator.generateJsonReport()
    : await reportGenerator.generateHtmlReport();

  logger.info(`Sync report output to artifact path.`);
  await syncer.sync(reportDirPath, config.artifactPath);
};

main().then(() => process.exit(0));
