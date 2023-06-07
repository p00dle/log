import { describe, test, expect } from 'vitest';
import { stringifyAnyFactory } from './stringifyAny';

describe('stringifyAny', () => {
  test('can be created without any arguments', () => {
    const stringifyAny = stringifyAnyFactory();
    expect(typeof stringifyAny).toBe('function');
  });
  test('stringifies any object', () => {
    const stringifyAny = stringifyAnyFactory();
    const object = {
      number: 1,
      boolean: false,
      bigint: BigInt(2),
      null: null,
      undefined: undefined,
      string: 'string',
      emptyArray: [],
      smallArray: [1, 2, 3],
      emptyObject: {},
      subObject: { a: 1, b: 2 },
      symbol: Symbol('bob'),
      function: function fun() {
        /* */
      },
    };
    expect(stringifyAny(object)).toBe(`{
  number: 1,
  boolean: false,
  bigint: 2,
  null: null,
  undefined: undefined,
  string: 'string',
  emptyArray: [],
  smallArray: [ 1, 2, 3 ],
  emptyObject: {},
  subObject: { a: 1, b: 2 },
  symbol: Symbol(bob),
  function: Function(fun)
}`);
  });
});
// TODO: add date formatting, testing for breaking strings and circular objects
