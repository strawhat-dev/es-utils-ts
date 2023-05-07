import { C as ConditionalKeys } from '../conditional-keys.d-ac881611.js';
import { P as PartialDeep } from '../partial-deep.d-c532d293.js';

/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

Use-cases:
- If you want to make a conditional branch based on the result of a comparison of two types.

@example
```
import type {IsEqual} from 'type-fest';

// This type returns a boolean for whether the given array includes the given item.
// `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```

@category Type Guard
@category Utilities
*/
type IsEqual<A, B> =
	(<G>() => G extends A ? 1 : 2) extends
	(<G>() => G extends B ? 1 : 2)
		? true
		: false;

/**
Filter out keys from an object.

Returns `never` if `Exclude` is strictly equal to `Key`.
Returns `never` if `Key` extends `Exclude`.
Returns `Key` otherwise.

@example
```
type Filtered = Filter<'foo', 'foo'>;
//=> never
```

@example
```
type Filtered = Filter<'bar', string>;
//=> never
```

@example
```
type Filtered = Filter<'bar', 'foo'>;
//=> 'bar'
```

@see {Except}
*/
type Filter<KeyType, ExcludeType> = IsEqual<KeyType, ExcludeType> extends true ? never : (KeyType extends ExcludeType ? never : KeyType);

type ExceptOptions = {
	/**
	Disallow assigning non-specified properties.

	Note that any omitted properties in the resulting type will be present in autocomplete as `undefined`.

	@default false
	*/
	requireExactProps?: boolean;
};

/**
Create a type from an object type without certain keys.

We recommend setting the `requireExactProps` option to `true`.

This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

@example
```
import type {Except} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type FooWithoutA = Except<Foo, 'a'>;
//=> {b: string}

const fooWithoutA: FooWithoutA = {a: 1, b: '2'};
//=> errors: 'a' does not exist in type '{ b: string; }'

type FooWithoutB = Except<Foo, 'b', {requireExactProps: true}>;
//=> {a: number} & Partial<Record<"b", never>>

const fooWithoutB: FooWithoutB = {a: 1, b: '2'};
//=> errors at 'b': Type 'string' is not assignable to type 'undefined'.
```

@category Object
*/
type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {requireExactProps: false}> = {
	[KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
} & (Options['requireExactProps'] extends true
	? Partial<Record<KeysType, never>>
	: {});

/**
Exclude keys from a shape that matches the given `Condition`.

This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.

@example
```
import type {Primitive, ConditionalExcept} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
//=> {run: () => void}
```

@example
```
import type {ConditionalExcept} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type NonStringKeysOnly = ConditionalExcept<Example, string>;
//=> {b: string | number; c: () => void; d: {}}
```

@category Object
*/
type ConditionalExcept<Base, Condition> = Except<
Base,
ConditionalKeys<Base, Condition>
>;

type HTMLTag = keyof HTMLElementTagNameMap;
type HTMLElementProps<T extends HTMLTag = 'div'> = PartialDeep<ConditionalExcept<HTMLElementTagNameMap[T], Function>>;
type CreateLinkOptions = {
    /**
     * The `textContent` property to be set on the element.
     * @defaultValue `href` passed from the *first argument*
     */
    textContent?: string;
    /**
     * If `true`, sets the `target` and `rel` properties of
     * the element accordingly to allow opening in new tabs.
     * @defaultValue `false`
     */
    newtab?: boolean;
};

/**
 * Like `querySelectorAll`, but returns an array of elements where
 * the `textContent` matches the regex provided as the first argument.
 * Selectors may still be optionally passed as the second argument.
 * *(defaults to `"*"` otherwise)*
 *
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 */
declare const querySelectorMatchAll: (regex: RegExp, selectors?: string, document?: Document) => Element[];
/**
 * Convenience wrapper for `document.create` which allows for the
 * more semantic assignment of properties from the second argument,
 * along with typed completions.
 *
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns some `HTMLElement` created from the given `tag` & `properties`
 */
declare const createElement: <T extends keyof HTMLElementTagNameMap>(tag: T, properties?: HTMLElementProps<T> | undefined, document?: Document) => HTMLElementTagNameMap[T];
/**
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns an `HTMLAnchorElement` created from the given `href` & `options`
 */
declare const createLink: (href: string, options?: CreateLinkOptions, document?: Document) => HTMLAnchorElement;
/**
 * Generates an html string using the everyday
 * boilerplate code most html templates should have already.
 * Body and header contents may also optionally be inserted if provided.
 */
declare const createHTMLDoc: ({ head, body }?: {
    head?: string | undefined;
    body?: string | undefined;
}) => string;

export { HTMLElementProps, HTMLTag, createElement, createHTMLDoc, createLink, querySelectorMatchAll };
