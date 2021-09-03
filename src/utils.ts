export const formatTimestamp = (timestamp: string): string =>
  new Date(Number.parseInt(timestamp, 10)).toISOString();
