import { describe, test, expect } from 'vitest';
import { consoleLogConsumerFactory } from './console';

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

  test('logs to console with all console methods', () => {
    const logs: string[] = [];
    const console = consoleFactory(logs);
    const consoleLogConsumer = consoleLogConsumerFactory(console);
    consoleLogConsumer('trace', 'trace');
    consoleLogConsumer('debug', 'debug');
    consoleLogConsumer('info', 'info');
    consoleLogConsumer('warn', 'warn');
    consoleLogConsumer('error', 'error');
    consoleLogConsumer('silent', 'silent');
    expect(logs).toEqual(['trace', 'debug', 'info', 'warn', 'error']);
  });
});
