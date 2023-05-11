import { Type, Union, Constructor, JsObject, primitive, TypedArray, Replace, KeyOf, Nullish } from './types.js';
import './conditional-except.d-9c5a45d7.js';
import { AsyncFunction } from 'type-fest/source/async-return-type.js';

type GeneratorFunction = (...args: any[]) => Generator;
type AsyncGeneratorFunction = (...args: any[]) => AsyncGenerator;
type AssertionOptions = {
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
type TypeName = Type<'Array Iterator' | 'Array' | 'ArrayBuffer' | 'AsyncFunction' | 'AsyncGenerator' | 'AsyncGeneratorFunction' | 'BigInt' | 'BigInt64Array' | 'BigUint64Array' | 'Boolean' | 'Date' | 'Error' | 'Float32Array' | 'Float64Array' | 'Function' | 'Generator' | 'GeneratorFunction' | 'Int16Array' | 'Int32Array' | 'Int8Array' | 'Map Iterator' | 'Map' | 'Null' | 'Number' | 'Object' | 'Promise' | 'RegExp' | 'Request' | 'Set Iterator' | 'Set' | 'SharedArrayBuffer' | 'String' | 'Symbol' | 'Uint16Array' | 'Uint32Array' | 'Uint8Array' | 'Uint8ClampedArray' | 'Undefined' | 'WeakMap' | 'WeakSet'>;
type MultiTypeQueryFunction = (value: unknown) => {
    anyOf: MultiTypeQuery;
    everyOf: MultiTypeQuery;
};
interface MultiTypeQuery {
    (...queries: unknown[]): boolean;
    (...queries: AssertionType[]): boolean;
}

/**
 * Used internally for some type checking methods in this module
 * and provides useful completions for some common built-in types.
 * @returns `string` representing the given `value`'s type from its *prototype*
 */
declare const type: (value: unknown) => Union<TypeName>;
declare const isArrayBuffer: (value: unknown) => value is ArrayBufferLike;
declare const isAsyncFunction: (value: unknown) => value is AsyncFunction;
declare const isAsyncGeneratorFunction: (value: unknown) => value is AsyncGeneratorFunction;
declare const isAsyncIterable: (value: unknown) => value is AsyncIterable<any>;
declare const isAsyncIterator: (value: unknown) => value is AsyncIterator<any, any, undefined>;
declare const isConstructor: (value: unknown) => value is Constructor<any>;
declare const isDate: (value: unknown) => value is Date;
declare const isElement: (value: unknown) => value is Element | Document;
declare const isError: (value: unknown) => value is Error;
declare const isGeneratorFunction: (value: unknown) => value is GeneratorFunction;
declare const isIterable: (value: unknown) => value is Iterable<any>;
declare const isIterator: (value: unknown) => value is Iterator<any, any, undefined>;
declare const isMap: (value: unknown) => value is Map<any, any>;
declare const isObject: (value: unknown) => value is JsObject<any>;
declare const isPrimitive: (value: unknown) => value is primitive;
declare const isPromise: (value: unknown) => value is Promise<any>;
declare const isRegExp: (value: unknown) => value is RegExp;
declare const isRequest: (value: unknown) => value is Request;
declare const isSet: (value: unknown) => value is Set<any>;
declare const isTypedArray: (value: unknown) => value is TypedArray;
declare const isWeakMap: (value: unknown) => value is WeakMap<object, any>;
declare const isWeakSet: (value: unknown) => value is WeakSet<object>;
declare const is: MultiTypeQueryFunction;
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
declare const assert: Readonly<{
    readonly isArrayBuffer: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isAsyncFunction: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isAsyncGeneratorFunction: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isAsyncIterable: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isAsyncIterator: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isConstructor: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isDate: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isElement: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isError: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isGeneratorFunction: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isIterable: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isIterator: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isMap: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isObject: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isPrimitive: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isPromise: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isRegExp: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isRequest: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isSet: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isTypedArray: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isWeakMap: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isWeakSet: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isArray: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isBigInt: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isBoolean: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isFunction: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isNull: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isNumber: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isString: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isSymbol: (value: unknown, opts?: AssertionOptions) => boolean;
    readonly isUndefined: (value: unknown, opts?: AssertionOptions) => boolean;
}>;
/** @internal */
type AssertionType = Replace<KeyOf<typeof assert>, 'is', ''>;

/**
 * Similarly to nullish coalescing, checks if given `value` is `undefined` or `null`.
 * @returns `true` if `value` is `undefined` or `null`; `false` otherwise
 */
declare const nullish: (value: unknown) => value is Nullish;
/**
 * An alternative to the *logical not* operator; checks if `value` is falsy ***(excluding `''` + `0`)***.
 * This is similar to nullish coalescing but with checks for `false` and `NaN` as well, for the common
 * use case of wanting to check if some value is *falsy/invalid*, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `undefined`, `null`, or `NaN`; `false` otherwise
 */
declare const not: (value: unknown) => value is false | Nullish;
/**
 * Utilizes `URL` constructor to check if the provided string is a valid url.
 * - Set the `protocol` option to a `string` to check for a custom protocol,
 * or set the `protocol` option to `'any'` to allow **any** protocol. Otherwise,
 * defaults to checking if the url has a valid *http* protocol (i.e. `http:` or `https:`).
 */
declare const validURL: (value: unknown, options?: {
    protocol?: Union<'any'>;
}) => value is URL & string;

export { AssertionType as A, not as B, validURL as C, isAsyncFunction as a, isAsyncGeneratorFunction as b, isAsyncIterable as c, isAsyncIterator as d, isConstructor as e, isDate as f, isElement as g, isError as h, isArrayBuffer as i, isGeneratorFunction as j, isIterable as k, isIterator as l, isMap as m, isObject as n, isPrimitive as o, isPromise as p, isRegExp as q, isRequest as r, isSet as s, type as t, isTypedArray as u, isWeakMap as v, isWeakSet as w, is as x, assert as y, nullish as z };
