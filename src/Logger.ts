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

  public isLogged(level: LogLevel): boolean {
    return LogLevelMap[this.level] <= LogLevelMap[level];
  }

  public trace(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.trace) return;
    console.trace(...messages);
  }

  public debug(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.debug) return;
    console.debug(...messages);
  }

  public info(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.info) return;
    console.info(...messages);
  }

  public warn(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.warn) return;
    console.warn(...messages);
  }

  public error(...messages: unknown[]) {
    if (LogLevelMap[this.level] > LogLevelMap.error) return;
    console.error(...messages);
  }
}

export const logger = new Logger();
