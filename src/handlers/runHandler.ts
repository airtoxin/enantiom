import { RunCommandOptions } from "../cliCommand";
import { join, resolve, sep } from "path";
import { EnantiomConfigLoader } from "../EnantiomConfigLoader";
import { ScreenshotService } from "../ScreenshotService";
import { StateFileService } from "../StateFileService";
import { logger } from "../Logger";
import { DirectorySyncer } from "../DirectorySyncer";
import { ReportGenerator } from "../ReportGenerator";
import { remove } from "fs-extra";
import { seq } from "../utils";

export const runHandler = async (
  commandOptions: RunCommandOptions
): Promise<number> => {
  seq(commandOptions.verbose).forEach(() => {
    logger.setVerbose();
  });

  const projectPath = resolve(__dirname, "..", "..");
  logger.info(`enantiom projectPath: ${projectPath}`);

  const configService = new EnantiomConfigLoader(
    projectPath,
    resolve(process.cwd(), commandOptions.config)
  );
  const rawConfig = await configService.loadRaw();

  const syncer = new DirectorySyncer();
  await remove(join(projectPath, "public", "assets"));
  await syncer.sync(
    // artifact_path maybe s3://... so using join(artifact_path) reduces
    // slashes in protocol s3://... to s3:/... it breaks syncing logic
    [rawConfig.artifact_path, "assets"].join(sep),
    join(projectPath, "public", "assets")
  );

  const stateFileService = new StateFileService(
    resolve(projectPath, "public", "assets", "state.json")
  );
  const state = await stateFileService.load();
  const config = await configService.load(state);

  const screenshotService = new ScreenshotService(config);
  const result = await screenshotService.takeScreenshotAndDiff();

  await stateFileService.appendSave(result);

  const reportGenerator = new ReportGenerator(
    config,
    resolve(projectPath, "public", "assets")
  );

  const reportDirPath = commandOptions.html
    ? await reportGenerator.generateHtmlReport()
    : await reportGenerator.generateJsonReport();
  logger.info(`Sync report output to artifact path.`);
  await syncer.sync(reportDirPath, config.artifactPath);

  return commandOptions.failInDiff &&
    result.screenshots.some((s) => s.diff != null)
    ? 1
    : 0;
};
