import { Log, consoleLogConsumerFactory, textFileLogConsumerFactory, nullLog } from '.';
import { describe, test, expect } from 'vitest';

describe('index', () => {
  test('should export Log class', () => expect(new Log()).toBeInstanceOf(Log));
  test('should export nullLog', () => expect(nullLog).toBeInstanceOf(Log));
  test('should export consoleLoggerConsumerFactory', () => expect(typeof consoleLogConsumerFactory).toBe('function'));
  test('should export textFileLogConsumerFactory', () => expect(typeof textFileLogConsumerFactory).toBe('function'));
});
