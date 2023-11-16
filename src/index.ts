export type { LogConsumer, LogFormatter, LogLevel } from './types';

export { Log } from './Log';
export { consoleLogConsumerFactory } from './consumers/console';
export { textFileLogConsumerFactory } from './consumers/text-file';
export { sqliteLogConsumerFactory } from './consumers/sqlite';
export { nullLog } from './instances';
