import { describe, test, expect } from 'vitest';
import { getTimestampString } from './getTimestampString';

describe('getTimestampString', () => {
  test('return current timestamp when called with no arguments', () => {
    expect(getTimestampString()).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/);
  });

  test('return string of a timestamp when called with a Date', () => {
    const dateString = '2021-02-03 04:05:06.000';
    expect(getTimestampString(new Date(dateString))).toBe(dateString);
  });

  test('returns local timezone timestamp when second argument is false', () => {
    const dateString = '2021-02-03 04:05:06.000';
    expect(getTimestampString(new Date(dateString), false)).toBe(dateString);
  });
});
