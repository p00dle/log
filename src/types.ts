export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
export type LogConsumer = (message: string, logLevel: LogLevel, namespace: string[]) => any;
export type LogFormatter = (message: string, logLevel: LogLevel, namespace: string[]) => string;
