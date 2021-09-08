#!/usr/bin/env node

import { parse } from "ts-command-line-args";
import { join, resolve } from "path";
import { spawn as cspawn } from "child_process";
import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { ScreenshotService } from "./ScreenshotService";
import { StateFileService } from "./StateFileService";
import { copy, ensureDir, rm } from "fs-extra";
import { logger } from "./Logger";

export type EnantiomCliArgument = {
  config: string;
  verbose?: boolean[];
  help?: boolean;
  "no-html"?: boolean;
};

const args = parse<EnantiomCliArgument>(
  {
    config: { type: String, alias: "c", description: "Path to config file" },
    verbose: {
      type: Boolean,
      alias: "v",
      multiple: true,
      optional: true,
      description: "Output verbose log (allow multiple)",
    },
    "no-html": {
      type: Boolean,
      optional: true,
      description: "Disable HTML report and output JSON only",
    },
    help: {
      type: Boolean,
      optional: true,
      alias: "h",
      description: "Prints this usage guide",
    },
  },
  {
    helpArg: "help",
    headerContentSections: [
      {
        header: "enantiom CLI",
      },
    ],
  }
);

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

  // sync previous output
  logger.debug(
    `Create temporal output directory: ${resolve(projectPath, OUTPUT_DIRNAME)}`
  );
  await rm(resolve(projectPath, OUTPUT_DIRNAME), {
    recursive: true,
    force: true,
  });
  await ensureDir(resolve(projectPath, OUTPUT_DIRNAME));
  logger.info(
    `Syncing previous state from ${resolve(
      process.cwd(),
      rawConfig.artifact_path,
      "assets"
    )} to ${resolve(projectPath, OUTPUT_DIRNAME)}`
  );
  try {
    await copy(
      resolve(process.cwd(), rawConfig.artifact_path, "assets"),
      resolve(projectPath, OUTPUT_DIRNAME),
      { overwrite: true }
    );
  } catch {
    logger.info(`No previous state file`);
  }
  logger.info(`Sync complete.`);

  const stateFileService = new StateFileService(
    resolve(projectPath, OUTPUT_DIRNAME, "state.json")
  );
  const state = await stateFileService.load();
  const config = await configService.load(state);

  const screenshotService = new ScreenshotService(config);
  const result = await screenshotService.takeScreenshotAndDiff("assets");

  await stateFileService.appendSave(result);

  if (args["no-html"]) {
    logger.info(`Output JSON report.`);
    await copy(
      resolve(projectPath, OUTPUT_DIRNAME),
      resolve(process.cwd(), rawConfig.artifact_path, "assets"),
      { overwrite: true }
    );
  } else {
    logger.info(`Output HTML report.`);
    const next = resolve(config.projectPath, "node_modules/.bin/next");
    logger.debug(`next cli path: ${next}`);

    try {
      await spawn(next, ["build", "--no-lint"], {
        silent: !logger.isLogged("debug"),
      });
    } catch (e) {
      logger.warn(`Building next project was failed.`);
      logger.error(e);
    }
    try {
      await spawn(
        next,
        [
          "export",
          logger.isLogged("debug") ? [] : ["-s"],
          "-o",
          resolve(process.cwd(), config.artifactPath),
        ].flat()
      );
    } catch (e) {
      logger.warn(`Exporting next project was failed.`);
      logger.error(e);
    }
  }
};

const spawn = (cmd: string, args: string[], { silent = false } = {}) =>
  new Promise<void>((resolvePromise, reject) => {
    const projectPath = resolve(__dirname, "..");
    logger.trace(`Spawning child process:${cmd} with args:${args}`);
    const p = cspawn(cmd, args, { cwd: projectPath });
    if (!silent) p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on("close", (code) => {
      logger.debug(`${cmd} process exit code: ${code}`);
      return code ? reject() : resolvePromise();
    });
  });

main().then(() => process.exit(0));
