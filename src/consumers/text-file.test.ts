import { describe, test, expect } from 'vitest';
import { textFileLogConsumerFactory } from './text-file';

describe('getTimestampString', () => {
  const writeFileFactory = (params: { str: string; writeCount: number; delay: number }) => {
    return async (_filePath: string, content: string, _params: { flag: 'a'; encoding: 'utf8' }) => {
      await new Promise((resolve) => setTimeout(resolve, params.delay));
      params.str += content;
      params.writeCount++;
    };
  };
  // const formatter = (message: string, logLevel: LogLevel, namespaces: string[]) => `${namespaces.join('.')}|${logLevel}|${message}`;

  test('writes logs to file; batches subsequent writes', async () => {
    const container = { str: '', writeCount: 0, delay: 10 };
    const textFileConsumer = textFileLogConsumerFactory('', writeFileFactory(container));
    textFileConsumer('trace', 'trace');
    textFileConsumer('debug', 'debug');
    textFileConsumer('info', 'info');
    textFileConsumer('warn', 'warn');
    textFileConsumer('error', 'error');
    textFileConsumer('silent', 'silent');
    await new Promise((resolve) => setTimeout(resolve, 100));
    const logs = container.str.split('\n');
    expect(logs).toEqual(['trace', 'debug', 'info', 'warn', 'error']);
    expect(container.writeCount).toBe(1);
  });
});
