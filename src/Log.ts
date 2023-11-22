import type { LogConsumer, LogFormatter, LogLevel } from './types';

import { LOG_LEVEL_VALUE } from './constants';
import { consoleLogConsumerFactory } from './consumers/console';
import { stringifyUnknownError } from './lib/stringifyUnknownError';
import { stringLogFormatterFactory } from './formatters/stringLogFormmater';

export class Log<T> {
  public trace: (message: string, details?: any) => void;
  public debug: (message: string, details?: any) => void;
  public info: (message: string, details?: any) => void;
  public warn: (message: string, details?: any) => void;
  public error: (message: unknown, details?: any) => void;

  protected consumer: LogConsumer<T>;
  protected formatter: LogFormatter<T>;
  protected children: Log<T>[] = [];
  protected logLevel: LogLevel;
  protected namespaces: string[];

  constructor(params: { consumer?: LogConsumer<T>; logLevel?: LogLevel; namespaces?: string[]; formatter?: LogFormatter<T> } = {}) {
    this.logLevel = params.logLevel || 'info';
    this.namespaces = params.namespaces || [];
    this.consumer = params.consumer || (consoleLogConsumerFactory() as LogConsumer<T>);
    this.formatter = params.formatter || (stringLogFormatterFactory() as LogFormatter<T>);
    this.trace = this.log.bind(this, 'trace');
    this.debug = this.log.bind(this, 'debug');
    this.info = this.log.bind(this, 'info');
    this.warn = this.log.bind(this, 'warn');
    this.error = this.logError.bind(this);
  }

  protected log(logLevel: LogLevel, message: string, details: any): void {
    if (this.logLevel !== 'silent' && LOG_LEVEL_VALUE[logLevel] >= LOG_LEVEL_VALUE[this.logLevel]) {
      const timestamp = new Date();
      const formattedLog = this.formatter(message, logLevel, this.namespaces, timestamp, details);
      this.consumer(formattedLog, logLevel);
    }
  }

  public logError(error: unknown, details?: any): void {
    const [message, trace] = stringifyUnknownError(error);
    this.log('error', message, details || trace);
  }

  public setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
    for (const child of this.children) child.setLogLevel(logLevel);
  }

  public getLogLevel(): LogLevel {
    return this.logLevel;
  }
  
  public namespace(namespace: string): Log<T> {
    const child = new Log({
      consumer: this.consumer,
      logLevel: this.logLevel,
      formatter: this.formatter,
      namespaces: [...this.namespaces, namespace],
    });
    this.children.push(child);
    return child;
  }
}
