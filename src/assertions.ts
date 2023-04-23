/* eslint-disable @typescript-eslint/ban-types */
import type { TypedArray } from 'type-fest';
import type { AsyncFunction, JsObject, Nullish, primitive } from '@/types';

/**
 * @returns the given `value`'s type from its *prototype*
 */
export const type = (value: unknown) => {
  return Object.prototype.toString.call(value).slice(8, -1);
};

/**
 * Similarly to nullish coalescing, checks if given `value` is `null` or `undefined`.
 * @returns `true` if `value` is `null` or `undefined`, `false` otherwise
 */
export const nullish = (value: unknown): value is Nullish => {
  return typeof value === 'undefined' || value === null;
};

/**
 * An alternative to the *logical not* operator, checks if `value` is falsy *(excluding `''` + `0`)*.
 * In some cases, one may want to check if some value is falsy/invalid, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `NaN`, `null` or `undefined`, `false` otherwise
 */
export const not = (value: unknown): value is Nullish | false => {
  return nullish(value) || Number.isNaN(value) || value === false;
};

// prettier-ignore
/**
 * Assertions for common standard built-in objects,
 * provided with type gaurds that perform runtime checks
 * to guarantee a given type in the following scope.
 *
 * Notes:
 * - `isObject` checks if the given value is a **plain** js object
 *   *(as opposed to `typeof value === 'object'`)*.
 * - avoids usage of the `instanceof` operator *(if possible)*, which relies
 *   on specific constructors, and instead checks the internal class using the
 *   object's *prototype* in order to provide consistent results across different
 *   execution contexts *(using internal {@link type} method)*.
 * - does not rely on platform specific *(e.g. node.js)* methods such as `util.types.isArrayBuffer`
 */
export const assert = {
  isArray: Array.isArray,
  isArrayBuffer: (value): value is ArrayBufferLike => /ArrayBuffer$/.test(type(value)),
  isAsyncFunction: (value): value is AsyncFunction => /^Async\w*Function$/.test(type(value)),
  isDate: (value): value is Date => type(value) === 'Date',
  isElement: (value): value is Element | Document => value instanceof Element || value instanceof Document,
  isError: (value): value is Error => type(value) === 'Error',
  isFunction: (value): value is Function => typeof value === 'function',
  isIterable: (value): value is Iterable<unknown> => !!value?.[Symbol.iterator],
  isIterator: (value): value is Iterator<unknown> => /Iterator$/.test(type(value)),
  isMap: (value): value is Map<unknown, unknown> => type(value) === 'Map',
  isObject: (value): value is JsObject => type(value) === 'Object',
  isPrimitive: (value): value is primitive => value !== Object(value),
  isPromise: (value): value is Promise<unknown> => type(value) === 'Promise',
  isRegExp: (value): value is RegExp => type(value) === 'RegExp',
  isSet: (value): value is Set<unknown> => type(value) === 'Set',
  isTypedArray: (value): value is TypedArray => ArrayBuffer.isView(value) && !(value instanceof DataView),
  isWeakMap: (value): value is WeakMap<object, unknown> => type(value) === 'WeakMap',
  isWeakSet: (value): value is WeakSet<object> => type(value) === 'WeakSet',
} as const satisfies JsObject<(value: unknown) => boolean>;

export const {
  isArray,
  isArrayBuffer,
  isAsyncFunction,
  isDate,
  isElement,
  isError,
  isFunction,
  isIterable,
  isIterator,
  isMap,
  isObject,
  isPrimitive,
  isPromise,
  isRegExp,
  isSet,
  isTypedArray,
  isWeakMap,
  isWeakSet,
} = assert;
