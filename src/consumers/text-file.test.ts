import { describe, test, expect } from 'vitest';
import { textFileLogConsumerFactory } from './text-file';
import { LogLevel } from '../types';

describe('getTimestampString', () => {
  const writeFileFactory = (params: { str: string; writeCount: number; delay: number }) => {
    return async (_filePath: string, content: string, _params: { flag: 'a'; encoding: 'utf8' }) => {
      await new Promise((resolve) => setTimeout(resolve, params.delay));
      params.str += content;
      params.writeCount++;
    };
  };
  const formatter = (message: string, logLevel: LogLevel, namespaces: string[]) => `${namespaces.join('.')}|${logLevel}|${message}`;

  test('writes logs to file; batches subsequent writes', async () => {
    const container = { str: '', writeCount: 0, delay: 10 };
    const textFileConsumer = textFileLogConsumerFactory('', formatter, writeFileFactory(container));
    textFileConsumer('trace', 'trace', ['1', '2']);
    textFileConsumer('debug', 'debug', ['1', '2']);
    textFileConsumer('info', 'info', ['1', '2']);
    textFileConsumer('warn', 'warn', ['1', '2']);
    textFileConsumer('error', 'error', ['1', '2']);
    textFileConsumer('silent', 'silent', ['1', '2']);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const logs = container.str.split('\n');
    expect(logs).toEqual(['1.2|trace|trace', '1.2|debug|debug', '1.2|info|info', '1.2|warn|warn', '1.2|error|error']);
    expect(container.writeCount).toBe(1);
  });
});
