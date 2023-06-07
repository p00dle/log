import { getTimestampString } from '../lib/getTimestampString';
import { stringifyAnyFactory } from '../lib/stringifyAny';
import { LogLevel, LogFormatter } from '../types';

export function stringLogFormatterFactory({ indent = '  ', width = 120 }: { indent?: string; width?: number } = {}): LogFormatter<string> {
  const stringifyAny = stringifyAnyFactory({ indent, width });
  const stringLogFormmater: LogFormatter<string> = function stringLogFormmater(message, logLevel, namespace, timestamp, details): string {
    const chunks: string[] = [getTimestampString(timestamp), logLevelString(logLevel), namespacesString(namespace)];
    const chunksString = chunks
      .filter((str) => str !== '')
      .map((str) => `[${str}]`)
      .join(' ');
    return chunksString + ' ' + message + (details ? '\n' + stringifyAny(details) : '');
  };
  return stringLogFormmater;
}
export function logLevelString(logLevel: LogLevel): string {
  return logLevel.toUpperCase().padEnd(5, ' ');
}

const NAMESPACE_SEPARATOR = '/';

function namespacesString(namespaces: string[]): string {
  return namespaces.filter((str) => str !== '').join(NAMESPACE_SEPARATOR);
}
