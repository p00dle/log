import type { LogConsumer, LogFormatter, LogLevel } from './types';

import { describe, test, expect } from 'vitest';
import { Log } from './Log';

interface LogType {
  message: string;
  logLevel: LogLevel;
  namespace: string[];
}

describe('Log', () => {
  function logCollectorFactory(arr: LogType[]): LogConsumer<LogType> {
    return (log) => arr.push(log);
  }

  const formatter: LogFormatter<LogType> = (message, logLevel, namespace) => ({ message, logLevel, namespace });

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
    const log = new Log({ consumer: logCollectorFactory(logs), logLevel: 'trace', formatter });
    log.trace('trace');
    log.debug('debug');
    log.info('info');
    log.warn('warn');
    log.error('error');
    expect(logs).toEqual([
      { message: 'trace', logLevel: 'trace', namespace: [] },
      { message: 'debug', logLevel: 'debug', namespace: [] },
      { message: 'info', logLevel: 'info', namespace: [] },
      { message: 'warn', logLevel: 'warn', namespace: [] },
      { message: 'error', logLevel: 'error', namespace: [] },
    ]);
  });

  test('log only at logLevel or above', () => {
    const traceLogs: LogType[] = [];
    const debugLogs: LogType[] = [];
    const infoLogs: LogType[] = [];
    const warnLogs: LogType[] = [];
    const errorLogs: LogType[] = [];
    const silentLogs: LogType[] = [];
    const traceLog = new Log({ consumer: logCollectorFactory(traceLogs), logLevel: 'trace', formatter });
    const debugLog = new Log({ consumer: logCollectorFactory(debugLogs), logLevel: 'debug', formatter });
    const infoLog = new Log({ consumer: logCollectorFactory(infoLogs), logLevel: 'info', formatter });
    const warnLog = new Log({ consumer: logCollectorFactory(warnLogs), logLevel: 'warn', formatter });
    const errorLog = new Log({ consumer: logCollectorFactory(errorLogs), logLevel: 'error', formatter });
    const silentLog = new Log({ consumer: logCollectorFactory(silentLogs), logLevel: 'silent', formatter });
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
    const log1 = new Log({ consumer, namespaces: ['ns1'], formatter });
    const log2 = log1.namespace('ns2');
    const log3 = log2.namespace('ns3');
    log1.info('');
    log2.info('');
    log3.info('');
    expect(logs[0].namespace).toEqual(['ns1']);
    expect(logs[1].namespace).toEqual(['ns1', 'ns2']);
    expect(logs[2].namespace).toEqual(['ns1', 'ns2', 'ns3']);
  });

  test('can adjust log level for itself and children', () => {
    const logs: LogType[] = [];
    const consumer = logCollectorFactory(logs);
    const log1 = new Log({ consumer, namespaces: ['ns1'], formatter });
    const log2 = log1.namespace('ns2');
    const log3 = log2.namespace('ns3');
    log1.setLogLevel('silent');
    log1.error('');
    log2.info('');
    log3.warn('');
    expect(logs).toHaveLength(0);
  });
});
