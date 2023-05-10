import { P as Primitive$1, I as IsNotFalse, a as ConditionalKeys, C as ConditionalExcept } from './conditional-except.d-b0cdb712.js';

/**
Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.

@example
```
import type {Simplify} from 'type-fest';

type PositionProps = {
	top: number;
	left: number;
};

type SizeProps = {
	width: number;
	height: number;
};

// In your editor, hovering over `Props` will show a flattened object with all the properties.
type Props = Simplify<PositionProps & SizeProps>;
```

Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.

If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.

@example
```
import type {Simplify} from 'type-fest';

interface SomeInterface {
	foo: number;
	bar?: string;
	baz: number | undefined;
}

type SomeType = {
	foo: number;
	bar?: string;
	baz: number | undefined;
};

const literal = {foo: 123, bar: 'hello', baz: 456};
const someType: SomeType = literal;
const someInterface: SomeInterface = literal;

function fn(object: Record<string, unknown>): void {}

fn(literal); // Good: literal object type is sealed
fn(someType); // Good: type is sealed
fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
```

@link https://github.com/microsoft/TypeScript/issues/15300

@category Object
*/
type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};

/**
Omit any index signatures from the given object type, leaving only explicitly defined properties.

This is the counterpart of `PickIndexSignature`.

Use-cases:
- Remove overly permissive signatures from third-party types.

This type was taken from this [StackOverflow answer](https://stackoverflow.com/a/68261113/420747).

It relies on the fact that an empty object (`{}`) is assignable to an object with just an index signature, like `Record<string, unknown>`, but not to an object with explicitly defined keys, like `Record<'foo' | 'bar', unknown>`.

(The actual value type, `unknown`, is irrelevant and could be any type. Only the key type matters.)

```
const indexed: Record<string, unknown> = {}; // Allowed

const keyed: Record<'foo', unknown> = {}; // Error
// => TS2739: Type '{}' is missing the following properties from type 'Record<"foo" | "bar", unknown>': foo, bar
```

Instead of causing a type error like the above, you can also use a [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to test whether a type is assignable to another:

```
type Indexed = {} extends Record<string, unknown>
	? '✅ `{}` is assignable to `Record<string, unknown>`'
	: '❌ `{}` is NOT assignable to `Record<string, unknown>`';
// => '✅ `{}` is assignable to `Record<string, unknown>`'

type Keyed = {} extends Record<'foo' | 'bar', unknown>
	? "✅ `{}` is assignable to `Record<'foo' | 'bar', unknown>`"
	: "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`";
// => "❌ `{}` is NOT assignable to `Record<'foo' | 'bar', unknown>`"
```

Using a [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#further-exploration), you can then check for each `KeyType` of `ObjectType`...

```
import type {OmitIndexSignature} from 'type-fest';

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType // Map each key of `ObjectType`...
	]: ObjectType[KeyType]; // ...to its original value, i.e. `OmitIndexSignature<Foo> == Foo`.
};
```

...whether an empty object (`{}`) would be assignable to an object with that `KeyType` (`Record<KeyType, unknown>`)...

```
import type {OmitIndexSignature} from 'type-fest';

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType
		// Is `{}` assignable to `Record<KeyType, unknown>`?
		as {} extends Record<KeyType, unknown>
			? ... // ✅ `{}` is assignable to `Record<KeyType, unknown>`
			: ... // ❌ `{}` is NOT assignable to `Record<KeyType, unknown>`
	]: ObjectType[KeyType];
};
```

If `{}` is assignable, it means that `KeyType` is an index signature and we want to remove it. If it is not assignable, `KeyType` is a "real" key and we want to keep it.

```
import type {OmitIndexSignature} from 'type-fest';

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType
		as {} extends Record<KeyType, unknown>
			? never // => Remove this `KeyType`.
			: KeyType // => Keep this `KeyType` as it is.
	]: ObjectType[KeyType];
};
```

@example
```
import type {OmitIndexSignature} from 'type-fest';

interface Example {
	// These index signatures will be removed.
	[x: string]: any
	[x: number]: any
	[x: symbol]: any
	[x: `head-${string}`]: string
	[x: `${string}-tail`]: string
	[x: `head-${string}-tail`]: string
	[x: `${bigint}`]: string
	[x: `embedded-${number}`]: string

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
}

type ExampleWithoutIndexSignatures = OmitIndexSignature<Example>;
// => { foo: 'bar'; qux?: 'baz' | undefined; }
```

@see PickIndexSignature
@category Object
*/
type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? never
		: KeyType]: ObjectType[KeyType];
};

/**
Convert a union type to an intersection type using [distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).

Inspired by [this Stack Overflow answer](https://stackoverflow.com/a/50375286/2172153).

@example
```
import type {UnionToIntersection} from 'type-fest';

type Union = {the(): void} | {great(arg: string): void} | {escape: boolean};

type Intersection = UnionToIntersection<Union>;
//=> {the(): void; great(arg: string): void; escape: boolean};
```

A more applicable example which could make its way into your library code follows.

@example
```
import type {UnionToIntersection} from 'type-fest';

class CommandOne {
	commands: {
		a1: () => undefined,
		b1: () => undefined,
	}
}

class CommandTwo {
	commands: {
		a2: (argA: string) => undefined,
		b2: (argB: string) => undefined,
	}
}

const union = [new CommandOne(), new CommandTwo()].map(instance => instance.commands);
type Union = typeof union;
//=> {a1(): void; b1(): void} | {a2(argA: string): void; b2(argB: string): void}

type Intersection = UnionToIntersection<Union>;
//=> {a1(): void; b1(): void; a2(argA: string): void; b2(argB: string): void}
```

@category Type
*/
type UnionToIntersection<Union> = (
	// `extends unknown` is always going to be the case and is used to convert the
	// `Union` into a [distributive conditional
	// type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
	Union extends unknown
		// The union type is used as the only argument to a function since the union
		// of function arguments is an intersection.
		? (distributedUnion: Union) => void
		// This won't happen.
		: never
		// Infer the `Intersection` type since TypeScript represents the positional
		// arguments of unions of functions as an intersection of the union.
) extends ((mergedIntersection: infer Intersection) => void)
	? Intersection
	: never;

type Numeric$1 = number | bigint;

/**
Given a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) return the {@link Primitive | primitive type} it belongs to, or `never` if it's not a primitive.

Use-case: Working with generic types that may be literal types.

@example
```
import type {LiteralToPrimitive} from 'type-fest';

// No overloads needed to get the correct return type
function plus<T extends number | bigint | string>(x: T, y: T): LiteralToPrimitive<T> {
	return x + (y as any);
}

plus('a', 'b'); // string
plus(1, 2); // number
plus(1n, 2n); // bigint
```

@category Type
*/
type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
		? bigint
		: T extends string
			? string
			: T extends boolean
				? boolean
				: T extends symbol
					? symbol
					: T extends null
						? null
						: T extends undefined
							? undefined
							: never;

/**
Get keys of the given type as strings.

Number keys are converted to strings.

Use-cases:
- Get string keys from a type which may have number keys.
- Makes it possible to index using strings retrieved from template types.

@example
```
import type {StringKeyOf} from 'type-fest';

type Foo = {
	1: number,
	stringKey: string,
};

type StringKeysOfFoo = StringKeyOf<Foo>;
//=> '1' | 'stringKey'
```

@category Object
*/
type StringKeyOf<BaseType> = `${Extract<keyof BaseType, string | number>}`;

/**
Returns a boolean for whether the given type is `never`.

@link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
@link https://stackoverflow.com/a/53984913/10292952
@link https://www.zhenghao.io/posts/ts-never

Useful in type utilities, such as checking if something does not occur.

@example
```
import type {IsNever} from 'type-fest';

type And<A, B> =
	A extends true
		? B extends true
			? true
			: false
		: false;

// https://github.com/andnp/SimplyTyped/blob/master/src/types/strings.ts
type AreStringsEqual<A extends string, B extends string> =
	And<
		IsNever<Exclude<A, B>> extends true ? true : false,
		IsNever<Exclude<B, A>> extends true ? true : false
	>;

type EndIfEqual<I extends string, O extends string> =
	AreStringsEqual<I, O> extends true
		? never
		: void;

function endIfEqual<I extends string, O extends string>(input: I, output: O): EndIfEqual<I, O> {
	if (input === output) {
		process.exit(0);
	}
}

endIfEqual('abc', 'abc');
//=> never

endIfEqual('abc', '123');
//=> void
```

@category Type Guard
@category Utilities
*/
type IsNever<T> = [T] extends [never] ? true : false;

/**
Returns a boolean for whether the given type `T` is the specified `LiteralType`.

@link https://stackoverflow.com/a/52806744/10292952

@example
```
LiteralCheck<1, number>
//=> true

LiteralCheck<number, number>
//=> false

LiteralCheck<1, string>
//=> false
```
*/
type LiteralCheck<T, LiteralType extends Primitive$1> = (
	IsNever<T> extends false // Must be wider than `never`
		? [T] extends [LiteralType] // Must be narrower than `LiteralType`
			? [LiteralType] extends [T] // Cannot be wider than `LiteralType`
				? false
				: true
			: false
		: false
);

/**
Returns a boolean for whether the given type `T` is one of the specified literal types in `LiteralUnionType`.

@example
```
LiteralChecks<1, Numeric>
//=> true

LiteralChecks<1n, Numeric>
//=> true

LiteralChecks<bigint, Numeric>
//=> false
```
*/
type LiteralChecks<T, LiteralUnionType> = (
	// Conditional type to force union distribution.
	// If `T` is none of the literal types in the union `LiteralUnionType`, then `LiteralCheck<T, LiteralType>` will evaluate to `false` for the whole union.
	// If `T` is one of the literal types in the union, it will evaluate to `boolean` (i.e. `true | false`)
	IsNotFalse<LiteralUnionType extends Primitive$1
		? LiteralCheck<T, LiteralUnionType>
		: never
	>
);

/**
Returns a boolean for whether the given type is a `string` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed string manipulation functions
	- constraining strings to be a string literal
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsStringLiteral} from 'type-fest';

type CapitalizedString<T extends string> = IsStringLiteral<T> extends true ? Capitalize<T> : string;

// https://github.com/yankeeinlondon/native-dash/blob/master/src/capitalize.ts
function capitalize<T extends Readonly<string>>(input: T): CapitalizedString<T> {
	return (input.slice(0, 1).toUpperCase() + input.slice(1)) as CapitalizedString<T>;
}

const output = capitalize('hello, world!');
//=> 'Hello, world!'
```

@category Type Guard
@category Utilities
*/
type IsStringLiteral<T> = LiteralCheck<T, string>;

/**
Returns a boolean for whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsNumericLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/src/types/boolean-logic/EndsWith.ts
type EndsWith<TValue, TEndsWith extends string> =
	TValue extends string
		? IsStringLiteral<TEndsWith> extends true
			? IsStringLiteral<TValue> extends true
				? TValue extends `${string}${TEndsWith}`
					? true
					: false
				: boolean
			: boolean
		: TValue extends number
			? IsNumericLiteral<TValue> extends true
				? EndsWith<`${TValue}`, TEndsWith>
				: false
			: false;

function endsWith<Input extends string | number, End extends string>(input: Input, end: End) {
	return `${input}`.endsWith(end) as EndsWith<Input, End>;
}

endsWith('abc', 'c');
//=> true

endsWith(123456, '456');
//=> true

const end = '123' as string;

endsWith('abc123', end);
//=> boolean
```

@category Type Guard
@category Utilities
*/
type IsNumericLiteral<T> = LiteralChecks<T, Numeric$1>;

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsBooleanLiteral} from 'type-fest';

const id = 123;

type GetId<AsString extends boolean> =
	IsBooleanLiteral<AsString> extends true
		? AsString extends true
			? `${typeof id}`
			: typeof id
		: number | string;

function getId<AsString extends boolean = false>(options?: {asString: AsString}) {
	return (options?.asString ? `${id}` : id) as GetId<AsString>;
}

const numberId = getId();
//=> 123

const stringId = getId({asString: true});
//=> '123'

declare const runtimeBoolean: boolean;
const eitherId = getId({asString: runtimeBoolean});
//=> number | string
```

@category Type Guard
@category Utilities
*/
type IsBooleanLiteral<T> = LiteralCheck<T, boolean>;

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsSymbolLiteral} from 'type-fest';

type Get<Obj extends Record<symbol, number>, Key extends keyof Obj> =
	IsSymbolLiteral<Key> extends true
		? Obj[Key]
		: number;

function get<Obj extends Record<symbol, number>, Key extends keyof Obj>(o: Obj, key: Key) {
	return o[key] as Get<Obj, Key>;
}

const symbolLiteral = Symbol('literal');
const symbolValue: symbol = Symbol('value');

get({[symbolLiteral]: 1} as const, symbolLiteral);
//=> 1

get({[symbolValue]: 1} as const, symbolValue);
//=> number
```

@category Type Guard
@category Utilities
*/
type IsSymbolLiteral<T> = LiteralCheck<T, symbol>;

/** Helper type for `IsLiteral`. */
type IsLiteralUnion<T> =
	| IsStringLiteral<T>
	| IsNumericLiteral<T>
	| IsBooleanLiteral<T>
	| IsSymbolLiteral<T>;

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsLiteral} from 'type-fest';

// https://github.com/inocan-group/inferred-types/blob/master/src/types/string-literals/StripLeading.ts
export type StripLeading<A, B> =
	A extends string
		? B extends string
			? IsLiteral<A> extends true
				? string extends B ? never : A extends `${B & string}${infer After}` ? After : A
				: string
			: A
		: A;

function stripLeading<Input extends string, Strip extends string>(input: Input, strip: Strip) {
	return input.replace(`^${strip}`, '') as StripLeading<Input, Strip>;
}

stripLeading('abc123', 'abc');
//=> '123'

const str = 'abc123' as string;

stripLeading(str, 'abc');
//=> string
```

@category Type Guard
@category Utilities
*/
type IsLiteral$1<T extends Primitive$1> = IsNotFalse<IsLiteralUnion<T>>;

type Numeric = number | bigint;
type NumberLike = number | `${number}`;
type Nullish = null | undefined;
type Nullable<T> = T | null;
type Maybe<T> = T | Nullish;
type Multi<T> = T | T[];
/**
 * *common primitves*
 * (may be serializable or literally typed).
 * @see {@link primitive} for any primitives
 */
type Primitive = Simplify<string | boolean | number | Nullish>;
/** any **non-nullish** value. */
interface Defined {
}
/** any **non-object** value. */
type primitive = Simplify<Primitive | bigint | symbol>;
/** any js value *(primitves or objects)*. */
type JsValue = Simplify<primitive | object>;
/** **plain** js objects. */
type JsObject<value = JsValue> = {
    [key: string]: value;
};
/**
 * More reliably extract a union of a given type's keys as strings by joining
 * any union types into an intersection *(so that `never` is not returned)*
 * and omitting the index signature *(so that literal keys may be resolved)*.
 */
type KeyOf<T, Fallback = string, Target = Composite<T>> = StringKeyOf<Target> extends never ? Fallback : StringKeyOf<Target>;
/**
 * Create a union type from a given object's values if possible;
 * else falls back to any js value by default.
 */
type ValueOf<T, Fallback = JsValue, Target = Composite<T>> = KeyOf<T> extends keyof Target ? Target[KeyOf<T>] : Fallback;
/**
 * Like {@link KeyOf}, but recursively extracts nested keys.
 */
type KeyOfDeep<T, Current = Composite<T>, Nested extends keyof Current = ConditionalKeys<Current, JsObject<any>>> = Type<KeyOf<Current> | (Nested extends never ? never : KeyOfDeep<Current[Nested]>)>;
/**
 * Like {@link ValueOf}, but recursively extracts nested values. \
 * Note: Values that are being recursed into themselves
 * *(i.e. parent values containing sub-values)* are not included.
 */
type ValueOfDeep<T, Current = Composite<T>, Nested extends keyof Current = ConditionalKeys<Current, JsObject<any>>> = Type<Current[ConditionalKeysExcept<Current, JsObject<any>>] | (Nested extends never ? never : ValueOfDeep<Current[Nested]>)>;
/**
 * *Improved version of type-fest's {@link https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts | LiteralUnion}*. \
 * Generic that allows for both the literal and
 * base types without sacrificing completions.
 * - base type automatically inferred from literal
 * - does not break on non-literal or complex object types
 */
type Union<T> = Type<T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & Defined : Narrow<T>)>;
/**
 * Narrow down a type to a base type.
 */
type Narrow<T> = Type<T extends Promise<infer Resolved> ? Promise<Narrow<Resolved>> : T extends (infer Item)[] ? Narrow<Item>[] : T extends Set<infer Item> ? Set<Narrow<Item>> : T extends Map<infer K, infer V> ? Map<Narrow<K>, Narrow<V>> : T extends JsObject<infer Values> ? JsObject<Values> : T extends Function ? Function : T extends object ? object : T extends primitive ? LiteralToPrimitive<T> : Defined>;
/**
 * Ensure a type can be resolved as an explicit defined type by joining
 * any unions into intersections, and omitting the index signature.
 */
type Composite<T> = OmitIndexSignature<UnionToIntersection<T>>;
/**
 * Inverse of type-fest's {@link https://github.com/sindresorhus/type-fest/blob/main/source/conditional-keys.d.ts | ConditionalKeys}.
 * Retrieves all of the keys that do **not** match the given type.
 */
type ConditionalKeysExcept<T, Omit> = keyof ConditionalExcept<T, Omit>;
/**
 * @internal
 * Utility type only used to contain long type definitions within angle brackets without leaving hanging indents.
 */
type Type<T> = T;
/**
 * @internal
 * Utility type to quickly check whether `T1` extends `T2`.
 */
type Extends<T1, T2> = T1 extends T2 ? true : false;
/**
 * @internal
 * Wrapped `IsLiteral` from type-fest
 */
type IsLiteral<T> = T extends primitive ? IsLiteral$1<T> : false;

export { Composite as C, Defined as D, Extends as E, JsValue as J, KeyOf as K, Maybe as M, Numeric as N, OmitIndexSignature as O, Primitive as P, Simplify as S, Type as T, Union as U, ValueOf as V, NumberLike as a, Nullish as b, Nullable as c, Multi as d, JsObject as e, KeyOfDeep as f, ValueOfDeep as g, Narrow as h, ConditionalKeysExcept as i, primitive as p };
