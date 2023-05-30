import { defaultLogFormmater } from '../formatters/defaultLogFormmater';
import { LogConsumer, LogFormatter, LogLevel } from '../types';

export type ConsoleLogCollector = Record<Exclude<LogLevel, 'silent'>, (message: string) => any>;

export function consoleLogConsumerFactory(
  logFormatter: LogFormatter = defaultLogFormmater,
  consoleLogCollector: ConsoleLogCollector = console
): LogConsumer {
  return function consoleLogConsumer(message, logLevel, namespaces) {
    if (logLevel !== 'silent') {
      consoleLogCollector[logLevel](logFormatter(message, logLevel, namespaces));
    }
  };
}
