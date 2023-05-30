import { describe, test, expect } from 'vitest';
import { stringifyUnknownError } from './stringifyUnknownError';

describe('stringifyUnknownError', () => {
  test('return error message if argument is an Error', () => {
    expect(stringifyUnknownError(new Error('abc'))).toBe('abc');
  });

  test('return string if argument is string', () => {
    expect(stringifyUnknownError('abc')).toBe('abc');
  });

  test('return result of toString if argument has toString method', () => {
    expect(stringifyUnknownError({ toString: () => 'abc' })).toBe('abc');
    expect(stringifyUnknownError(['a', 'b', 'c'])).toBe('a,b,c');
  });

  test('can take any value and returns it casted to string', () => {
    expect(stringifyUnknownError(1)).toBe('1');
    expect(stringifyUnknownError(NaN)).toBe('NaN');
    expect(stringifyUnknownError(undefined)).toBe('undefined');
    expect(stringifyUnknownError(null)).toBe('null');
    expect(stringifyUnknownError({})).toBe('[object Object]');
  });
});
