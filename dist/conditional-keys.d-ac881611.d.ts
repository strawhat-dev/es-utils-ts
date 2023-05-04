/**
Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).

@category Type
*/
type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- It has to be an `interface` so that it can be merged.
	interface SymbolConstructor {
		readonly observable: symbol;
	}
}

/**
Matches any primitive, `Date`, or `RegExp` value.
*/
type BuiltIns = Primitive | Date | RegExp;

/**
Returns a boolean for whether the given `boolean` is not `false`.
*/
type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;

/**
Extract the keys from a type where the value type of the key extends the given `Condition`.

Internally this is used for the `ConditionalPick` and `ConditionalExcept` types.

@example
```
import type {ConditionalKeys} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c?: string;
	d: {};
}

type StringKeysOnly = ConditionalKeys<Example, string>;
//=> 'a'
```

To support partial types, make sure your `Condition` is a union of undefined (for example, `string | undefined`) as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type StringKeysAndUndefined = ConditionalKeys<Example, string | undefined>;
//=> 'a' | 'c'
```

@category Object
*/
type ConditionalKeys<Base, Condition> = NonNullable<
// Wrap in `NonNullable` to strip away the `undefined` type from the produced union.
{
	// Map through all the keys of the given base type.
	[Key in keyof Base]:
	// Pick only keys with types extending the given `Condition` type.
	Base[Key] extends Condition
	// Retain this key since the condition passes.
		? Key
	// Discard this key since the condition fails.
		: never;

	// Convert the produced object into a union type of the keys which passed the conditional test.
}[keyof Base]
>;

export { BuiltIns as B, ConditionalKeys as C, IsNotFalse as I, Primitive as P };
