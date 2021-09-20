import { Command } from "commander";
import { z } from "zod";

export class EnantiomCli {
  private program = new Command();
  private runCommand = this.program
    .command("run")
    .requiredOption("-c, --config <path>", "Path to config file")
    .option(
      "-v, --verbose",
      "Increase verbosity (allow multiple)",
      (_, v: number = 0) => v + 1
    )
    .option("--no-html", "Disable HTML report and output JSON only")
    .option("--fail-in-diff", "CLI fails when diff exists");
  private generateRegionCommand = this.program
    .command("generate-region")
    .requiredOption("-f, --diff-file <path>", "Path to diff file")
    .option(
      "-v, --verbose",
      "Increase verbosity (allow multiple)",
      (_, v: number = 0) => v + 1
    );
  private exitCode = 0;

  constructor(handlers: EnantiomCommandHandlers) {
    this.runCommand.action(async (rawOptions) => {
      const options = RunCommandOptions.parse(rawOptions);
      this.exitCode = await handlers.run(options);
    });
    this.generateRegionCommand.action(async (rawOptions) => {
      const options = GenerateRegionCommandOptions.parse(rawOptions);
      this.exitCode = await handlers.generateRegion(options);
    });
  }

  async execute(argv: string[]): Promise<number> {
    await this.program.parseAsync(argv);
    return this.exitCode;
  }
}

export type RunCommandOptions = z.infer<typeof RunCommandOptions>;
const RunCommandOptions = z.object({
  html: z.boolean().default(true),
  verbose: z.number().default(0),
  config: z.string(),
  failInDiff: z.boolean().default(false),
});

export type GenerateRegionCommandOptions = z.infer<
  typeof GenerateRegionCommandOptions
>;
const GenerateRegionCommandOptions = z.object({
  verbose: z.number().default(0),
  diffFile: z.string(),
});

export type EnantiomCommandHandlers = {
  run: CommandHandler<RunCommandOptions>;
  generateRegion: CommandHandler<GenerateRegionCommandOptions>;
};
export type CommandHandler<T> = (options: T) => Promise<number>;
