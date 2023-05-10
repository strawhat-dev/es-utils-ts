import './conditional-except.d-f489500f.js';
import { AsyncFunction } from 'type-fest/source/async-return-type.js';
import { T as Type, U as Union, e as JsObject, p as primitive, K as KeyOf, b as Nullish } from './types-64712e38.js';

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
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
type Constructor<T, Arguments extends unknown[] = any[]> = new(...arguments_: Arguments) => T;

type ReplaceOptions = {
	all?: boolean;
};

/**
Represents a string with some or all matches replaced by a replacement.

Use-case:
- `snake-case-path` to `dotted.path.notation`
- Changing date/time format: `01-08-2042` → `01/08/2042`
- Manipulation of type properties, for example, removal of prefixes

@example
```
import {Replace} from 'type-fest';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement, {all: true}>;

// The return type is the exact string literal, not just `string`.

replace('hello ?', '?', '🦄');
//=> 'hello 🦄'

replace('hello ??', '?', '❓');
//=> 'hello ❓?'

replaceAll('10:42:00', ':', '-');
//=> '10-42-00'

replaceAll('__userName__', '__', '');
//=> 'userName'

replaceAll('My Cool Title', ' ', '');
//=> 'MyCoolTitle'
```

@category String
@category Template literal
*/
type Replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends ReplaceOptions = {},
> = Input extends `${infer Head}${Search}${infer Tail}`
	? Options['all'] extends true
		? `${Head}${Replacement}${Replace<Tail, Search, Replacement, Options>}`
		: `${Head}${Replacement}${Tail}`
	: Input;

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
 * Utilizes `URL` constructor (as opposed to regular expressions)
 * to check if the provided string is a valid url.
 *
 * Set the `http` option to `false` to allow any urls that are parsable by the `URL`
 * constructor (e.g. `"foo:bar"`), instead of just those with a valid "http/https" protocol.
 *
 * *(defaults to `true` since this is the most common desired behavior)*
 */
declare const validURL: (value: string, options?: {
    http: boolean;
}) => boolean;

export { AssertionType as A, not as B, validURL as C, isAsyncFunction as a, isAsyncGeneratorFunction as b, isAsyncIterable as c, isAsyncIterator as d, isConstructor as e, isDate as f, isElement as g, isError as h, isArrayBuffer as i, isGeneratorFunction as j, isIterable as k, isIterator as l, isMap as m, isObject as n, isPrimitive as o, isPromise as p, isRegExp as q, isRequest as r, isSet as s, type as t, isTypedArray as u, isWeakMap as v, isWeakSet as w, is as x, assert as y, nullish as z };
