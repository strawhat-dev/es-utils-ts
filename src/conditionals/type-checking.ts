/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AsyncFunction,
  Constructor,
  JsObject,
  KeyOf,
  Replace,
  TypedArray,
  Union,
  primitive,
} from '../types';
import type {
  AssertionOptions,
  AsyncGeneratorFunction,
  GeneratorFunction,
  MultiTypeQueryFunction,
  TypeName,
} from './types';

import { equal, inspect } from '../externals';

/**
 * Used internally for some type checking methods in this module
 * and provides useful completions for some common built-in types.
 * @returns `string` representing the given `value`'s type from its *prototype*
 */
export const type = (value: unknown): Union<TypeName> => Object.prototype.toString.call(value).slice(8, -1);

// conditionals with type gaurding
export const isArrayBuffer = (value: unknown): value is ArrayBufferLike => /^(Shared)?ArrayBuffer$/.test(type(value));
export const isAsyncFunction = (value: unknown): value is AsyncFunction => type(value) === 'AsyncFunction';
export const isAsyncGeneratorFunction = (value: unknown): value is AsyncGeneratorFunction => type(value) === 'AsyncGeneratorFunction';
export const isAsyncIterable = (value: unknown): value is AsyncIterable<any> => !!value?.[Symbol.iterator as keyof {}];
export const isAsyncIterator = (value: unknown): value is AsyncIterator<any> => /^Async.*(Generator|Iterator)$/.test(type(value));
export const isConstructor = (value: unknown): value is Constructor<any> => value?.['prototype' as keyof {}]?.['constructor'] === (value ?? '');
export const isDate = (value: unknown): value is Date => type(value) === 'Date';
export const isElement = (value: unknown): value is Element | Document => value instanceof Element || value instanceof Document;
export const isError = (value: unknown): value is Error => type(value) === 'Error';
export const isGeneratorFunction = (value: unknown): value is GeneratorFunction => type(value) === 'GeneratorFunction';
export const isIterable = (value: unknown): value is Iterable<any> => !!value?.[Symbol.iterator as keyof {}];
export const isIterator = (value: unknown): value is Iterator<any> => /(^Generator|Iterator)$/.test(type(value));
export const isMap = (value: unknown): value is Map<any, any> => type(value) === 'Map';
export const isObject = (value: unknown): value is JsObject<any> => type(value) === 'Object';
export const isPrimitive = (value: unknown): value is primitive => value !== Object(value);
export const isPromise = (value: unknown): value is Promise<any> => type(value) === 'Promise';
export const isRegExp = (value: unknown): value is RegExp => type(value) === 'RegExp';
export const isRequest = (value: unknown): value is Request => type(value) === 'Request';
export const isSet = (value: unknown): value is Set<any> => type(value) === 'Set';
export const isTypedArray = (value: unknown): value is TypedArray => ArrayBuffer.isView(value) && !(value instanceof DataView);
export const isWeakMap = (value: unknown): value is WeakMap<object, any> => type(value) === 'WeakMap';
export const isWeakSet = (value: unknown): value is WeakSet<object> => type(value) === 'WeakSet';
export const is: MultiTypeQueryFunction = (value) => ({
  anyOf: (...queries) => queries.some(querycallback(value)),
  everyOf: (...queries) => queries.every(querycallback(value)),
});

/**
 * Assertions for commonly used built-in types.
 *
 * Notes:
 * - `isObject` checks if the given value is a **plain** js object
 *   *(as opposed to `typeof value === 'object'`)*.
 * - avoids usage of the `instanceof` operator *(if applicable)*, which relies
 *   on specific constructors, and instead checks the internal class using the
 *   object's *prototype* in order to provide consistent results across different
 *   execution contexts *(using internal {@link type} method)*.
 * - does not rely on platform specific *(e.g. node.js)* methods such as `util.types.isArrayBuffer`
 */
export const assert = Object.freeze({
  isArrayBuffer: createAssertion(isArrayBuffer),
  isAsyncFunction: createAssertion(isAsyncFunction),
  isAsyncGeneratorFunction: createAssertion(isAsyncGeneratorFunction),
  isAsyncIterable: createAssertion(isAsyncIterable),
  isAsyncIterator: createAssertion(isAsyncIterator),
  isConstructor: createAssertion(isConstructor),
  isDate: createAssertion(isDate),
  isElement: createAssertion(isElement),
  isError: createAssertion(isError),
  isGeneratorFunction: createAssertion(isGeneratorFunction),
  isIterable: createAssertion(isIterable),
  isIterator: createAssertion(isIterator),
  isMap: createAssertion(isMap),
  isObject: createAssertion(isObject),
  isPrimitive: createAssertion(isPrimitive),
  isPromise: createAssertion(isPromise),
  isRegExp: createAssertion(isRegExp),
  isRequest: createAssertion(isRequest),
  isSet: createAssertion(isSet),
  isTypedArray: createAssertion(isTypedArray),
  isWeakMap: createAssertion(isWeakMap),
  isWeakSet: createAssertion(isWeakSet),

  // native type checking methods
  isArray: createAssertion(Array.isArray),
  isBigInt: createAssertion((value) => typeof value === 'bigint', 'BigInt'),
  isBoolean: createAssertion((value) => typeof value === 'boolean', 'Boolean'),
  isFunction: createAssertion((value) => typeof value === 'function', 'Function'),
  isNull: createAssertion((value) => value === null, 'Null'),
  isNumber: createAssertion((value) => typeof value === 'number', 'Number'),
  isString: createAssertion((value) => typeof value === 'string', 'String'),
  isSymbol: createAssertion((value) => typeof value === 'symbol', 'Symbol'),
  isUndefined: createAssertion((value) => typeof value === 'undefined', 'Undefined'),
} as const);

/** @internal */
export type AssertionType = Replace<KeyOf<typeof assert>, 'is', ''>;

/** @internal */
const querycallback = (value: unknown) => {
  return (query: unknown) => {
    if (typeof query === 'boolean') return query;
    if (isConstructor(query)) return value instanceof query;
    if (typeof query === 'string' && `is${query}` in assert) {
      return assert[`is${query as AssertionType}`](value, { quiet: true });
    }

    return equal(value, query);
  };
};

/** @internal */
function createAssertion(assertion: (value: unknown) => boolean, expected = assertion.name.slice(2)) {
  return (value: unknown, opts: AssertionOptions = {}) => {
    if (assertion(value)) return true;
    const { quiet, onError = console.error } = opts;
    if (onError && !quiet) {
      const code = 'AssertionError';
      const cause = { code, value, expected, actual: type(value) };
      const err = new Error(`[${code}] expected instance of ${expected}; received ${inspect(value)}`, { cause });
      if (onError === 'throw') throw err;
      else if (typeof onError === 'function') onError(err);
    }

    return false;
  };
}
