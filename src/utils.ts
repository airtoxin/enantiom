export const formatTimestamp = (timestamp: string): string =>
  new Date(Number.parseInt(timestamp, 10)).toISOString();

export const switcher =
  <K extends string, U = any>(arms: { [key in K]: U }) =>
  (key: K): U => {
    return arms[key];
  };
