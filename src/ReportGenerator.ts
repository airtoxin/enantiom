import { logger } from "./Logger";
import { copy } from "fs-extra";
import t from "temp";
import { resolve } from "path";
import { spawn as cspawn } from "child_process";

export class ReportGenerator {
  constructor(
    private readonly projectPath: string,
    private readonly outputDirPath: string
  ) {}

  public async generateJsonReport(): Promise<string> {
    const temp = t.track();
    const reportDirPath = await temp.mkdir();

    logger.info(`Generate JSON report.`);
    await copy(
      this.outputDirPath,
      reportDirPath,
      // resolve(process.cwd(), rawConfig.artifact_path, "assets"),
      { overwrite: true }
    );
    logger.info(`Generate JSON report success.`);
    return reportDirPath;
  }

  public async generateHtmlReport(): Promise<string> {
    const temp = t.track();
    const reportDirPath = await temp.mkdir();

    logger.info(`Generate HTML report.`);

    const next = resolve(this.projectPath, "node_modules/.bin/next");
    logger.debug(`next cli path: ${next}`);

    await spawn(next, ["build", "--no-lint"], {
      silent: !logger.isLogged("debug"),
    });
    await spawn(
      next,
      [
        "export",
        logger.isLogged("debug") ? [] : ["-s"],
        "-o",
        reportDirPath,
        // resolve(process.cwd(), config.artifactPath),
      ].flat()
    );

    logger.info(`Generate HTML report success.`);
    return reportDirPath;
  }
}

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
