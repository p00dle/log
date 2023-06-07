import { describe, test, expect } from 'vitest';
import { stringifyUnknownError } from './stringifyUnknownError';

describe('stringifyUnknownError', () => {
  test('return error message if argument is an Error', () => {
    const [message, trace] = stringifyUnknownError(new Error('abc'));

    expect(message).toBe('abc');
    expect(trace).toMatch(/Error: abc\n(\s+at \S+\n?)*/);
  });

  test('if argument is an Error without stack property return empty string for details', () => {
    class TracelessError extends Error {
      public stack = undefined;
    }
    const [_message, trace] = stringifyUnknownError(new TracelessError('abc'));
    expect(trace).toBe('');
  });
  test('return string if argument is string', () => {
    expect(stringifyUnknownError('abc')).toEqual(['abc', '']);
  });

  test('return result of toString if argument has toString method', () => {
    expect(stringifyUnknownError({ toString: () => 'abc' })).toEqual(['abc', '']);
    expect(stringifyUnknownError(['a', 'b', 'c'])).toEqual(['a,b,c', '']);
  });

  test('can take any value and returns it casted to string', () => {
    expect(stringifyUnknownError(1)).toEqual(['1', '']);
    expect(stringifyUnknownError(NaN)).toEqual(['NaN', '']);
    expect(stringifyUnknownError(undefined)).toEqual(['undefined', '']);
    expect(stringifyUnknownError(null)).toEqual(['null', '']);
    expect(stringifyUnknownError({})).toEqual(['[object Object]', '']);
  });
});
