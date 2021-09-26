const LogLevelMap = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
} as const;

type LogLevel = keyof typeof LogLevelMap;

class Logger {
  constructor(public level: LogLevel = "info") {}

  public setVerbose() {
    if (this.level === "error") {
      this.level = "warn";
    } else if (this.level === "warn") {
      this.level = "info";
    } else if (this.level === "info") {
      this.level = "debug";
    } else if (this.level === "debug") {
      this.level = "trace";
    } else if (this.level === "trace") {
      logger.info(`Cannot up verbosity anymore.`);
    }
  }

  public setQuiet() {
    if (this.level === "error") {
      logger.info(`Cannot up quietness anymore.`);
    } else if (this.level === "warn") {
      this.level = "error";
    } else if (this.level === "info") {
      this.level = "warn";
    } else if (this.level === "debug") {
      this.level = "info";
    } else if (this.level === "trace") {
      this.level = "debug";
    }
  }

  public isLogged(level: LogLevel): boolean {
    return LogLevelMap[this.level] <= LogLevelMap[level];
  }

  public trace(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.trace) return;
    console.trace(`trace  - `, ...messages);
  }

  public debug(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.debug) return;
    console.debug(`debug  - `, ...messages);
  }

  public info(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.info) return;
    console.info(`info  - `, ...messages);
  }

  public warn(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.warn) return;
    console.warn(`warn  - `, ...messages);
  }

  public error(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.error) return;
    console.error(`error  - `, ...messages);
  }
}

export const logger = new Logger();
