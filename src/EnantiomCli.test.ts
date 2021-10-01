import { EnantiomCli, EnantiomCommandHandlers } from "./EnantiomCli";

const createDefaultContext = () => {
  const runArgv = ["node", "enantiom", "run", "-c", "enantiom.config.json"];
  const parsedRunOptions = {
    config: "enantiom.config.json",
    failInDiff: false,
    html: true,
    verbose: 0,
    quiet: 0,
  };
  const handlers: EnantiomCommandHandlers = {
    run: async () => 0,
    generateRegion: async () => 0,
  };

  return {
    runArgv,
    parsedRunOptions,
    handlers,
  };
};

describe("EnantiomCli", () => {
  describe("unknown command", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("It should exit with error when got unknown command", async () => {
      const { handlers } = createDefaultContext();
      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any);
      const cli = new EnantiomCli(handlers);

      await cli.execute(["node", "enantiom", "unknown-command"]);

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("run command", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Default test case", async () => {
      const { runArgv, parsedRunOptions, handlers } = createDefaultContext();
      handlers.run = async (options) => {
        expect(options).toEqual(parsedRunOptions);
        return 0;
      };
      const cli = new EnantiomCli(handlers);

      await expect(cli.execute(runArgv)).resolves.toBe(0);

      expect.assertions(2);
    });

    test("The number returned by the handler should be returned as the result", async () => {
      const { runArgv, handlers } = createDefaultContext();
      handlers.run = async () => 12345;
      const cli = new EnantiomCli(handlers);
      await expect(cli.execute(runArgv)).resolves.toBe(12345);
    });

    test("It should set html field value to false when --no-html option is given", async () => {
      const { runArgv, parsedRunOptions, handlers } = createDefaultContext();
      handlers.run = async (options) => {
        expect(options).toEqual({
          ...parsedRunOptions,
          html: false,
        });
        return 0;
      };
      const cli = new EnantiomCli(handlers);

      await cli.execute([...runArgv, "--no-html"]);

      expect.assertions(1);
    });

    test("It should raise verbosity as many times as the -v options are given", async () => {
      const { runArgv, parsedRunOptions, handlers } = createDefaultContext();
      handlers.run = async (options) => {
        expect(options).toEqual({
          ...parsedRunOptions,
          verbose: 10,
        });
        return 0;
      };
      const cli = new EnantiomCli(handlers);

      await cli.execute([
        ...runArgv,
        "-vvvvv",
        "--verbose",
        "--verbose",
        "-v",
        "-vv",
      ]);

      expect.assertions(1);
    });

    test("It should raise quietness as many times as the -q options are given", async () => {
      const { runArgv, parsedRunOptions, handlers } = createDefaultContext();
      handlers.run = async (options) => {
        expect(options).toEqual({
          ...parsedRunOptions,
          quiet: 10,
        });
        return 0;
      };
      const cli = new EnantiomCli(handlers);

      await cli.execute([
        ...runArgv,
        "-qqqqq",
        "--quiet",
        "--quiet",
        "-q",
        "-qq",
      ]);

      expect.assertions(1);
    });

    test("It should exit with error when got unknown options", async () => {
      const { runArgv, handlers } = createDefaultContext();
      const mockExit = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any);
      const cli = new EnantiomCli(handlers);

      await cli.execute([...runArgv, "--unknown-argument-in-test", "foo-bar"]);

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
