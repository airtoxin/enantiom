import { Command } from "commander";
import { z } from "zod";

export type RunCommandOptions = z.infer<typeof RunCommandOptions>;
const RunCommandOptions = z.object({
  html: z.boolean().default(true),
  verbose: z.number().default(0),
  config: z.string(),
  failInDiff: z.boolean().default(false),
});

const createCommand = () => {
  const program = new Command();

  const runCommand = program.command("run");
  runCommand.requiredOption("-c, --config <path>", "Path to config file");
  runCommand.option(
    "-v, --verbose",
    "Increase verbosity (allow multiple)",
    (_, v: number = 0) => v + 1
  );
  runCommand.option("--no-html", "Disable HTML report and output JSON only");
  runCommand.option("--fail-in-diff", "CLI fails when diff exists");

  return { runCommand, program };
};

export const execRunCommand = (
  handler: (options: RunCommandOptions) => Promise<number>,
  args = process.argv
): Promise<number> => {
  const { runCommand, program } = createCommand();

  const p = new Promise<number>((resolve, reject) => {
    runCommand.action((options) => {
      const runOptions = RunCommandOptions.parse(options);
      handler(runOptions).then(resolve).catch(reject);
    });
  });

  program.parse(args);
  return p;
};
