import { getTimestampString } from '../lib/getTimestampString';
import { LogLevel, LogFormatter } from '../types';

export const defaultLogFormmater: LogFormatter = function formatLog(message: string, logLevel: LogLevel, namespaces: string[]): string {
  const chunks: string[] = [getTimestampString(), logLevelString(logLevel), namespacesString(namespaces)];
  const chunksString = chunks
    .filter((str) => str !== '')
    .map((str) => `[${str}]`)
    .join(' ');
  return chunksString + ' ' + message;
};

function logLevelString(logLevel: LogLevel): string {
  return logLevel.toUpperCase().padEnd(5, ' ');
}

const NAMESPACE_SEPARATOR = '/';

function namespacesString(namespaces: string[]): string {
  return namespaces.filter((str) => str !== '').join(NAMESPACE_SEPARATOR);
}
