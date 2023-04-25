/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Union } from '@/types';
import type { AssertionType } from '@/conditionals';

export type TypeName = Union<
  | 'Array Iterator'
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
  | 'Map Iterator'
  | 'Map'
  | 'Null'
  | 'Number'
  | 'Object'
  | 'Promise'
  | 'RegExp'
  | 'Set Iterator'
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
  | 'WeakSet'
>;

export type AssertionOptions = {
  /**
   * If `true` throw an error for failed assertions.
   * By default, errors are printed to `stderr` using `console.error`
   */
  throwOnError?: boolean;
};

export type GeneratorFunction = (...args: any[]) => Generator;

export type AsyncGeneratorFunction = (...args: any[]) => AsyncGenerator;

export type MultiTypeQueryFunction = (value: unknown) => {
  anyOf: MultiTypeQuery;
  everyOf: MultiTypeQuery;
};

/** @internal */
interface MultiTypeQuery {
  (...queries: unknown[]): boolean;
  (...queries: AssertionType[]): boolean;
}
