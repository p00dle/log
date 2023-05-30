import type { LogConsumer, LogLevel } from './types';

import { LOG_LEVEL_VALUE } from './constants';
import { consoleLogConsumerFactory } from './consumers/console';
import { stringifyUnknownError } from './lib/stringifyUnknownError';

export class Log {
  public trace: (message: string) => void;
  public debug: (message: string) => void;
  public info: (message: string) => void;
  public warn: (message: string) => void;
  public error: (message: unknown) => void;

  protected consumer: LogConsumer;
  protected children: Log[] = [];
  protected logLevel: LogLevel;
  protected namespaces: string[];

  constructor(params: { consumer?: LogConsumer; logLevel?: LogLevel; namespaces?: string[] } = {}) {
    this.logLevel = params.logLevel || 'info';
    this.namespaces = params.namespaces || [];
    this.consumer = params.consumer || consoleLogConsumerFactory();
    this.trace = this.log.bind(this, 'trace');
    this.debug = this.log.bind(this, 'debug');
    this.info = this.log.bind(this, 'info');
    this.warn = this.log.bind(this, 'warn');
    this.error = this.logError.bind(this);
  }

  public log(logLevel: LogLevel, message: string): void {
    if (this.logLevel !== 'silent' && LOG_LEVEL_VALUE[logLevel] >= LOG_LEVEL_VALUE[this.logLevel]) {
      this.consumer(message, logLevel, this.namespaces);
    }
  }

  public logError(error: unknown): void {
    this.log('error', stringifyUnknownError(error));
  }

  public setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
    for (const child of this.children) child.setLogLevel(logLevel);
  }

  public namespace(namespace: string): Log {
    const child = new Log({
      consumer: this.consumer,
      logLevel: this.logLevel,
      namespaces: [...this.namespaces, namespace],
    });
    this.children.push(child);
    return child;
  }
}
