import { describe, expect, test } from 'vitest';
import { stringLogFormatterFactory } from './stringLogFormmater';
import { LogLevel } from '../types';

describe('defaultLogFormatter', () => {
  test('formats logs into a single string', () => {
    const stringLogFormmater = stringLogFormatterFactory();
    const timestamp = new Date();
    const fullLogs = (
      [
        { message: 'msg1', logLevel: 'trace', namespaces: ['ns1', 'ns2'], details: 'det1' },
        { message: 'msg2', logLevel: 'debug', namespaces: ['ns1', 'ns2'], details: '' },
        { message: 'msg3', logLevel: 'info', namespaces: ['ns1', 'ns2'] },
        { message: 'msg4', logLevel: 'warn', namespaces: ['ns1', 'ns2'] },
        { message: 'msg5', logLevel: 'error', namespaces: ['ns1', 'ns2'] },
      ] satisfies { message: string; logLevel: LogLevel; namespaces: string[]; details?: string }[]
    ).map(({ message, logLevel, namespaces, details }) => stringLogFormmater(message, logLevel, namespaces, timestamp, details));
    const logTimestamps = fullLogs.map((log) => log.slice(0, 25));
    const timestampRegex = /\[\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\]/;
    const logMessages = fullLogs.map((log) => log.slice(26));
    expect(logTimestamps.every((ts) => timestampRegex.test(ts))).toBe(true);
    expect(logMessages).toEqual([
      `[TRACE] [ns1/ns2] msg1\n'det1'`,
      '[DEBUG] [ns1/ns2] msg2',
      '[INFO ] [ns1/ns2] msg3',
      '[WARN ] [ns1/ns2] msg4',
      '[ERROR] [ns1/ns2] msg5',
    ]);
  });
});
