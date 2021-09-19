import { execRunCommand } from "./cliCommand";

describe("handleRunCommand", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createDefaultContext = () => {
    const cliArgs = ["node", "enantiom", "run", "-c", "enantiom.config.json"];
    const parsedOptions = {
      config: "enantiom.config.json",
      failInDiff: false,
      html: true,
      verbose: 0,
    };

    return {
      cliArgs,
      parsedOptions,
    };
  };

  test("Default test case", async () => {
    const { cliArgs, parsedOptions } = createDefaultContext();

    await expect(
      execRunCommand(async (options) => {
        expect(options).toEqual(parsedOptions);
        return 0;
      }, cliArgs)
    ).resolves.toBe(0);

    expect.assertions(2);
  });

  test("The number returned by the handler should be returned as the result", async () => {
    const { cliArgs } = createDefaultContext();
    await expect(execRunCommand(async () => 12345, cliArgs)).resolves.toBe(
      12345
    );
  });

  test("It should set html field value to false when --no-html option is given", async () => {
    const { cliArgs, parsedOptions } = createDefaultContext();

    await expect(
      execRunCommand(
        async (options) => {
          expect(options).toEqual({
            ...parsedOptions,
            html: false,
          });
          return 0;
        },
        [...cliArgs, "--no-html"]
      )
    ).resolves.toBe(0);
    expect.assertions(2);
  });

  test("It should raise verbosity as many times as the -v option is given", async () => {
    const { cliArgs, parsedOptions } = createDefaultContext();

    await expect(
      execRunCommand(
        async (options) => {
          expect(options).toEqual({
            ...parsedOptions,
            verbose: 10,
          });
          return 0;
        },
        [...cliArgs, "-vvvvv", "--verbose", "--verbose", "-v", "-vv"]
      )
    ).resolves.toBe(0);
    expect.assertions(2);
  });

  test("It should exit with error when got unknown options", async () => {
    const { cliArgs } = createDefaultContext();
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);

    await execRunCommand(
      async () => 0,
      [...cliArgs, "--unknown-argument-in-test", "foo-bar"]
    );

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
