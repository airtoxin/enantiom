#!/usr/bin/env node

import { parse } from "ts-command-line-args";
import { join, resolve } from "path";
import { spawn as cspawn } from "child_process";
import { EnantiomConfigLoader } from "./EnantiomConfigLoader";
import { ScreenshotService } from "./ScreenshotService";
import { StateFileService } from "./StateFileService";
import { copy, ensureDir } from "fs-extra";

export type EnantiomCliArgument = {
  config: string;
};

const args = parse<EnantiomCliArgument>({
  config: { type: String, alias: "c" },
});

const OUTPUT_DIRNAME = join("public", "assets");

const main = async () => {
  const projectPath = resolve(__dirname, "..");
  const configService = new EnantiomConfigLoader(
    projectPath,
    resolve(process.cwd(), args.config)
  );
  const rawConfig = await configService.loadRaw();
  // sync previous output
  try {
    await ensureDir(resolve(projectPath, OUTPUT_DIRNAME));
    await copy(
      resolve(process.cwd(), rawConfig.artifact_path, "assets"),
      resolve(projectPath, OUTPUT_DIRNAME)
    );
  } catch {
    // nothing to do
  }

  const stateFileService = new StateFileService(
    resolve(projectPath, OUTPUT_DIRNAME, "state.json")
  );
  const state = await stateFileService.load();
  const config = await configService.load(state);

  const screenshotService = new ScreenshotService(config);
  const result = await screenshotService.takeScreenshotAndDiff(OUTPUT_DIRNAME);

  await stateFileService.appendSave(result);

  const next = resolve(config.projectPath, "node_modules/.bin/next");
  await spawn(next, ["build", "--no-lint"], { silent: true });
  await spawn(next, [
    "export",
    "-s",
    "-o",
    resolve(process.cwd(), config.artifactPath),
  ]);
};

const spawn = (cmd: string, args: string[], { silent = false } = {}) =>
  new Promise<void>((resolvePromise, reject) => {
    const projectPath = resolve(__dirname, "..");
    const p = cspawn(cmd, args, { cwd: projectPath });
    if (!silent) p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on("close", (code) => {
      return code ? reject() : resolvePromise();
    });
  });

main().then(() => process.exit(0));
