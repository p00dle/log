export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export type LogConsumer<T = string> = (log: T, logLevel: LogLevel) => any;
export type LogFormatter<T = string> = (message: string, logLevel: LogLevel, namespace: string[], timestamp: Date, details?: any) => T;
