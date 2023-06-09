/* eslint-disable @typescript-eslint/no-explicit-any */
export type TypeName =
  | 'ArrayIterator'
  | 'Array'
  | 'ArrayBuffer'
  | 'AsyncFunction'
  | 'AsyncGenerator'
  | 'AsyncGeneratorFunction'
  | 'BigInt'
  | 'BigInt64Array'
  | 'BigUint64Array'
  | 'Boolean'
  | 'Date'
  | 'Error'
  | 'Float32Array'
  | 'Float64Array'
  | 'Function'
  | 'Generator'
  | 'GeneratorFunction'
  | 'Int16Array'
  | 'Int32Array'
  | 'Int8Array'
  | 'MapIterator'
  | 'Map'
  | 'Null'
  | 'Number'
  | 'Object'
  | 'Promise'
  | 'RegExp'
  | 'Request'
  | 'SetIterator'
  | 'Set'
  | 'SharedArrayBuffer'
  | 'String'
  | 'Symbol'
  | 'Uint16Array'
  | 'Uint32Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Undefined'
  | 'WeakMap'
  | 'WeakSet';

export type GeneratorFunction = (...args: any[]) => Generator;

export type AsyncGeneratorFunction = (...args: any[]) => AsyncGenerator;

export type AssertionOptions = {
  /**
   * Set to `throw` to throw on failed assertions
   * or pass a callback function to handle the error.
   * @defaultValue `console.error`
   */
  onError?: 'throw' | ((err: Error) => unknown);
  /**
   * Suppress any errors and return a boolean instead.
   * (overrides `onError` when set to `true`)
   * @defaultValue `false`
   */
  quiet?: boolean;
};

export type MultiTypeQueryFunction = (value: unknown) => {
  anyOf: MultiTypeQuery;
  everyOf: MultiTypeQuery;
};

interface MultiTypeQuery {
  (...queries: unknown[]): boolean;
  (...queries: (TypeName | 'Primitive')[]): boolean;
}
