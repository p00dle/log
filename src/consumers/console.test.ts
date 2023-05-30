import { describe, test, expect } from 'vitest';
import { consoleLogConsumerFactory } from './console';
import { LogLevel } from '../types';

describe('getTimestampString', () => {
  const consoleFactory = (arr: string[]) => {
    const addToArray = (str: string) => arr.push(str);
    return {
      trace: addToArray,
      debug: addToArray,
      info: addToArray,
      warn: addToArray,
      error: addToArray,
    };
  };
  const formatter = (message: string, logLevel: LogLevel, namespaces: string[]) => `${namespaces.join('.')}|${logLevel}|${message}`;

  test('logs to console with all console methods', () => {
    const logs: string[] = [];
    const console = consoleFactory(logs);
    const consoleLogConsumer = consoleLogConsumerFactory(formatter, console);
    consoleLogConsumer('trace', 'trace', ['1', '2']);
    consoleLogConsumer('debug', 'debug', ['1', '2']);
    consoleLogConsumer('info', 'info', ['1', '2']);
    consoleLogConsumer('warn', 'warn', ['1', '2']);
    consoleLogConsumer('error', 'error', ['1', '2']);
    consoleLogConsumer('silent', 'silent', ['1', '2']);
    expect(logs).toEqual(['1.2|trace|trace', '1.2|debug|debug', '1.2|info|info', '1.2|warn|warn', '1.2|error|error']);
  });
});
