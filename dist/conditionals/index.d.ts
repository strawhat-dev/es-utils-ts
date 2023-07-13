import { Constructor, Primitive, TypedArray, EmptyObject } from 'type-fest';
import { Union, AsyncFunction, JsObject, Nullish, NullishOrFalse } from '../type-utils.js';
import 'type-fest/source/spread.js';

type TypeName = 'ArrayIterator' | 'Array' | 'ArrayBuffer' | 'AsyncFunction' | 'AsyncGenerator' | 'AsyncGeneratorFunction' | 'BigInt' | 'BigInt64Array' | 'BigUint64Array' | 'Boolean' | 'Date' | 'Error' | 'Float32Array' | 'Float64Array' | 'Function' | 'Generator' | 'GeneratorFunction' | 'Int16Array' | 'Int32Array' | 'Int8Array' | 'MapIterator' | 'Map' | 'Null' | 'Number' | 'Object' | 'Promise' | 'RegExp' | 'Request' | 'SetIterator' | 'Set' | 'SharedArrayBuffer' | 'String' | 'Symbol' | 'Uint16Array' | 'Uint32Array' | 'Uint8Array' | 'Uint8ClampedArray' | 'Undefined' | 'WeakMap' | 'WeakSet';
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
type MultiTypeQueryFunction = (value: unknown) => {
    anyOf: MultiTypeQuery;
    everyOf: MultiTypeQuery;
};
interface MultiTypeQuery {
    (...queries: unknown[]): boolean;
    (...queries: (TypeName | 'Primitive')[]): boolean;
}

/**
 * Used internally for some type checking methods in this module
 * and provides useful completions for some common built-in types.
 * @returns `string` representing the given `value`'s type from its *prototype* (without spaces)
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
declare const isPrimitive: (value: unknown) => value is Primitive;
declare const isPromise: (value: unknown) => value is Promise<any>;
declare const isRegExp: (value: unknown) => value is RegExp;
declare const isRequest: (value: unknown) => value is Request;
declare const isSet: (value: unknown) => value is Set<any>;
declare const isTemplateStringsArray: (value: unknown) => value is TemplateStringsArray;
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
declare const assert: {
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
    readonly isTemplateStringsArray: (value: unknown, opts?: AssertionOptions) => boolean;
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
};

/**
 * Checks if a value is `nullish`, but **also considers `NaN`** *(because the
 * contexts in which one would consider `NaN` to be a valid condition to continue
 * would most likely be next to none)*.
 * @returns `true` if `value` is `NaN`, `null`, or `undefined`; `false` otherwise
 */
declare const nullish: (value: unknown) => value is Nullish;
declare const nullishOrFalse: (value: unknown) => value is NullishOrFalse;
declare const nullishOrEmptyObj: (value: unknown) => value is Nullish | EmptyObject | never[];
/**
 * Utilizes `URL` constructor to check if the provided string is a valid url.
 * - Set the `protocol` option to a `string` to check for a custom protocol,
 * or set the `protocol` option to `'any'` to allow **any** protocol. Otherwise,
 * defaults to checking if the url has a valid *http* protocol (i.e. `http:` or `https:`).
 */
declare const validURL: (value: unknown, options?: {
    protocol?: Union<'any'>;
}) => value is URL & string;

export { assert, is, isArrayBuffer, isAsyncFunction, isAsyncGeneratorFunction, isAsyncIterable, isAsyncIterator, isConstructor, isDate, isElement, isError, isGeneratorFunction, isIterable, isIterator, isMap, isObject, isPrimitive, isPromise, isRegExp, isRequest, isSet, isTemplateStringsArray, isTypedArray, isWeakMap, isWeakSet, nullish, nullishOrEmptyObj, nullishOrFalse, type, validURL };
