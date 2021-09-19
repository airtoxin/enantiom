export const formatTimestamp = (timestamp: string): string =>
  new Date(Number.parseInt(timestamp, 10)).toISOString();

export const switcher =
  <K extends string, U = any>(arms: { [key in K]: U }) =>
  (key: K): U => {
    return arms[key];
  };

export const assertUnreachable = (x: never): never => {
  throw new Error(`Expect unreachable code but ${x} has non never type.`);
};

export const seq = (num: number): number[] =>
  Array.from(Array(num)).map((_, i) => i);
