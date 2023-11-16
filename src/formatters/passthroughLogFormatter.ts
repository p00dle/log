import type { LogDetails, LogFormatter } from '../types';

export const passthroughLogFormatter: LogFormatter<LogDetails> = (message, logLevel, namespace, timestamp, details) => ({
  message,
  logLevel,
  namespace,
  timestamp,
  details,
});
