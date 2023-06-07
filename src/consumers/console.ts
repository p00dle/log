import { LogConsumer, LogLevel } from '../types';

export type ConsoleLogCollector = Record<Exclude<LogLevel, 'silent'>, (message: string) => any>;

export function consoleLogConsumerFactory(consoleLogCollector: ConsoleLogCollector = console): LogConsumer {
  return function consoleLogConsumer(log, logLevel) {
    if (logLevel !== 'silent') {
      consoleLogCollector[logLevel](log);
    }
  };
}
