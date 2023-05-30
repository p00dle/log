import type { LogConsumer, LogLevel } from './types';

import { describe, test, expect } from 'vitest';
import { Log } from './Log';

interface LogType {
  message: string;
  logLevel: LogLevel;
  namespaces: string[];
}

describe('Log', () => {
  function logCollectorFactory(arr: LogType[]): LogConsumer {
    return (message, logLevel, namespaces) => arr.push({ message, logLevel, namespaces });
  }

  test('all constructor params are optional', () => {
    const log1 = new Log({});
    const log2 = new Log({ logLevel: 'silent' });
    const log3 = new Log({ namespaces: ['ns'] });
    expect(log1).toBeInstanceOf(Log);
    expect(log2).toBeInstanceOf(Log);
    expect(log3).toBeInstanceOf(Log);
  });

  test('log using all methods', () => {
    const logs: LogType[] = [];
    const log = new Log({ consumer: logCollectorFactory(logs), logLevel: 'trace' });
    log.trace('trace');
    log.debug('debug');
    log.info('info');
    log.warn('warn');
    log.error('error');
    expect(logs).toEqual([
      { message: 'trace', logLevel: 'trace', namespaces: [] },
      { message: 'debug', logLevel: 'debug', namespaces: [] },
      { message: 'info', logLevel: 'info', namespaces: [] },
      { message: 'warn', logLevel: 'warn', namespaces: [] },
      { message: 'error', logLevel: 'error', namespaces: [] },
    ]);
  });

  test('log only at logLevel or above', () => {
    const traceLogs: LogType[] = [];
    const debugLogs: LogType[] = [];
    const infoLogs: LogType[] = [];
    const warnLogs: LogType[] = [];
    const errorLogs: LogType[] = [];
    const silentLogs: LogType[] = [];
    const traceLog = new Log({ consumer: logCollectorFactory(traceLogs), logLevel: 'trace' });
    const debugLog = new Log({ consumer: logCollectorFactory(debugLogs), logLevel: 'debug' });
    const infoLog = new Log({ consumer: logCollectorFactory(infoLogs), logLevel: 'info' });
    const warnLog = new Log({ consumer: logCollectorFactory(warnLogs), logLevel: 'warn' });
    const errorLog = new Log({ consumer: logCollectorFactory(errorLogs), logLevel: 'error' });
    const silentLog = new Log({ consumer: logCollectorFactory(silentLogs), logLevel: 'silent' });
    for (const log of [traceLog, debugLog, infoLog, warnLog, errorLog, silentLog]) {
      log.trace('');
      log.debug('');
      log.info('');
      log.warn('');
      log.error('');
    }
    expect(traceLogs.length).toBe(5);
    expect(debugLogs.length).toBe(4);
    expect(infoLogs.length).toBe(3);
    expect(warnLogs.length).toBe(2);
    expect(errorLogs.length).toBe(1);
    expect(silentLogs.length).toBe(0);
  });

  test('create children ', () => {
    const logs: LogType[] = [];
    const consumer = logCollectorFactory(logs);
    const log1 = new Log({ consumer, namespaces: ['ns1'] });
    const log2 = log1.namespace('ns2');
    const log3 = log2.namespace('ns3');
    log1.info('');
    log2.info('');
    log3.info('');
    expect(logs[0].namespaces).toEqual(['ns1']);
    expect(logs[1].namespaces).toEqual(['ns1', 'ns2']);
    expect(logs[2].namespaces).toEqual(['ns1', 'ns2', 'ns3']);
  });

  test('can adjust log level for itself and children', () => {
    const logs: LogType[] = [];
    const consumer = logCollectorFactory(logs);
    const log1 = new Log({ consumer, namespaces: ['ns1'] });
    const log2 = log1.namespace('ns2');
    const log3 = log2.namespace('ns3');
    log1.setLogLevel('silent');
    log1.error('');
    log2.info('');
    log3.warn('');
    expect(logs).toHaveLength(0);
  });
});

// describe('consoleLogConsumerFactory', () => {
//   function consoleFactory(arr: string[]): ConsoleLike {
//     return {
//       debug: (str) => arr.push(str),
//       info: (str) => arr.push(str),
//       warn: (str) => arr.push(str),
//       error: (str) => arr.push(str),
//     };
//   }
//   it('should work with default params', () => {
//     const logs: string[] = [];
//     const mockConsole = consoleFactory(logs);
//     const consoleLogConsumer = consoleLogConsumerFactory({ console: mockConsole });
//     consoleLogConsumer({ namespace: 'NS', timestamp: Date.now(), logLevel: 'info', payload: 'log' });
//     expect(logs[0]).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} UTC \[info \] \[NS\]/);
//   });
//   it('should use local timezone', () => {
//     const logs: string[] = [];
//     const mockConsole = consoleFactory(logs);
//     const consoleLogConsumer = consoleLogConsumerFactory({
//       console: mockConsole,
//       useUTC: false,
//       useColors: false,
//       useLogLevel: false,
//     });
//     consoleLogConsumer({ namespace: '', timestamp: Date.now(), logLevel: 'warn', payload: '' });
//     expect(logs[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} UTC\+\d+ $/);
//   });
//   it('should be able to stringify error message with trace', () => {
//     const logs: string[] = [];
//     const mockConsole = consoleFactory(logs);
//     const consoleLogConsumer = consoleLogConsumerFactory({
//       useColors: false,
//       useLogLevel: false,
//       useNamespace: false,
//       useTimestamp: false,
//       useUTC: false,
//       console: mockConsole,
//     });
//     consoleLogConsumer({ namespace: '', timestamp: 0, logLevel: 'debug', payload: new Error('error message') });
//     consoleLogConsumer({ namespace: '', timestamp: 0, logLevel: 'debug', payload: Error('error message') });
//     const [errorMessage, ...traceLines] = logs[0].split(/\r*\n/);
//     expect(errorMessage).toMatch(/^\s*Error: error message\s*$/);
//     expect(traceLines.length > 5).toBe(true);
//   });
