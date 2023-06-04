import type { AsyncFunction, Constructor, JsObject, TypedArray, Union, primitive } from '../type-utils.js';
import type { AssertionOptions, AsyncGeneratorFunction, GeneratorFunction, MultiTypeQueryFunction, TypeName } from './types.js';
/**
 * Used internally for some type checking methods in this module
 * and provides useful completions for some common built-in types.
 * @returns `string` representing the given `value`'s type from its *prototype*
 */
export declare const type: (value: unknown) => Union<TypeName>;
export declare const isArrayBuffer: (value: unknown) => value is ArrayBufferLike;
export declare const isAsyncFunction: (value: unknown) => value is AsyncFunction;
export declare const isAsyncGeneratorFunction: (value: unknown) => value is AsyncGeneratorFunction;
export declare const isAsyncIterable: (value: unknown) => value is AsyncIterable<any>;
export declare const isAsyncIterator: (value: unknown) => value is AsyncIterator<any, any, undefined>;
export declare const isConstructor: (value: unknown) => value is Constructor<any>;
export declare const isDate: (value: unknown) => value is Date;
export declare const isElement: (value: unknown) => value is Element | Document;
export declare const isError: (value: unknown) => value is Error;
export declare const isGeneratorFunction: (value: unknown) => value is GeneratorFunction;
export declare const isIterable: (value: unknown) => value is Iterable<any>;
export declare const isIterator: (value: unknown) => value is Iterator<any, any, undefined>;
export declare const isMap: (value: unknown) => value is Map<any, any>;
export declare const isObject: (value: unknown) => value is JsObject<any>;
export declare const isPrimitive: (value: unknown) => value is primitive;
export declare const isPromise: (value: unknown) => value is Promise<any>;
export declare const isRegExp: (value: unknown) => value is RegExp;
export declare const isRequest: (value: unknown) => value is Request;
export declare const isSet: (value: unknown) => value is Set<any>;
export declare const isTemplateStringsArray: (value: unknown) => value is TemplateStringsArray;
export declare const isTypedArray: (value: unknown) => value is TypedArray;
export declare const isWeakMap: (value: unknown) => value is WeakMap<object, any>;
export declare const isWeakSet: (value: unknown) => value is WeakSet<object>;
export declare const is: MultiTypeQueryFunction;
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
export declare const assert: Readonly<{
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
}>;
