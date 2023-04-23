import { b as Nullish, A as AsyncFunction, e as JsObject, p as primitive } from './types-9825c360.js';

/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.

@category Array
*/
type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/**
 * @returns the given `value`'s type from its *prototype*
 */
declare const type: (value: unknown) => string;
/**
 * Similarly to nullish coalescing, checks if given `value` is `null` or `undefined`.
 * @returns `true` if `value` is `null` or `undefined`, `false` otherwise
 */
declare const nullish: (value: unknown) => value is Nullish;
/**
 * An alternative to the *logical not* operator, checks if `value` is falsy *(excluding `''` + `0`)*.
 * In some cases, one may want to check if some value is falsy/invalid, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `NaN`, `null` or `undefined`, `false` otherwise
 */
declare const not: (value: unknown) => value is false | Nullish;
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
declare const assert: {
    readonly isArray: (arg: any) => arg is any[];
    readonly isArrayBuffer: (value: unknown) => value is ArrayBufferLike;
    readonly isAsyncFunction: (value: unknown) => value is AsyncFunction;
    readonly isDate: (value: unknown) => value is Date;
    readonly isElement: (value: unknown) => value is Element | Document;
    readonly isError: (value: unknown) => value is Error;
    readonly isFunction: (value: unknown) => value is Function;
    readonly isIterable: (value: unknown) => value is Iterable<unknown>;
    readonly isIterator: (value: unknown) => value is Iterator<unknown, any, undefined>;
    readonly isMap: (value: unknown) => value is Map<unknown, unknown>;
    readonly isObject: (value: unknown) => value is JsObject;
    readonly isPrimitive: (value: unknown) => value is primitive;
    readonly isPromise: (value: unknown) => value is Promise<unknown>;
    readonly isRegExp: (value: unknown) => value is RegExp;
    readonly isSet: (value: unknown) => value is Set<unknown>;
    readonly isTypedArray: (value: unknown) => value is TypedArray;
    readonly isWeakMap: (value: unknown) => value is WeakMap<object, unknown>;
    readonly isWeakSet: (value: unknown) => value is WeakSet<object>;
};

export { assert, not, nullish, type };
