import { logger } from "./Logger";
import { copy } from "fs-extra";
import t from "temp";
import { resolve } from "path";
import { spawn as cspawn } from "child_process";
import { EnantiomInternalConfig } from "./EnantiomInternalConfig";

export class ReportGenerator {
  constructor(
    private readonly config: EnantiomInternalConfig,
    private readonly outputDirPath: string
  ) {}

  public async generateJsonReport(): Promise<string> {
    const temp = t.track();
    const reportDirPath = await temp.mkdir();

    logger.info(`Generate JSON report to ${reportDirPath}`);
    await copy(this.outputDirPath, reportDirPath, { overwrite: true });
    return reportDirPath;
  }

  public async generateHtmlReport(): Promise<string> {
    const temp = t.track();
    const reportDirPath = await temp.mkdir();

    logger.info(`Generate HTML report to ${reportDirPath}`);

    const next = resolve(this.config.projectPath, "node_modules/.bin/next");
    logger.debug(`next cli path: ${next}`);

    await this.spawn(next, ["build", "--no-lint"], {
      silent: !logger.isLogged("debug"),
    });
    await this.spawn(
      next,
      [
        "export",
        logger.isLogged("debug") ? [] : ["-s"],
        "-o",
        reportDirPath,
      ].flat()
    );

    return reportDirPath;
  }

  spawn(cmd: string, args: string[], { silent = false } = {}) {
    return new Promise<void>((resolvePromise, reject) => {
      const projectPath = resolve(__dirname, "..");
      logger.debug(`Spawning child process:${cmd} with args:${args}`);
      const p = cspawn(cmd, args, {
        cwd: projectPath,
        env: { ...process.env, NEXT_PUBLIC_BASE_PATH: this.config.basePath },
      });
      if (!silent) p.stdout.pipe(process.stdout);
      p.stderr.pipe(process.stderr);
      p.on("close", (code) => {
        logger.debug(`${cmd} process exit code: ${code}`);
        return code ? reject() : resolvePromise();
      });
    });
  }
}
