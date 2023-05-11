import { S as Simplify, E as Except, B as BuiltIns, H as HasMultipleCallSignatures, U as UnknownRecord, a as UnknownArrayOrTuple, I as IsBothExtends, N as NonEmptyTuple, A as ArrayTail, F as FirstArrayElement, b as Primitive$1, c as ConditionalKeys, C as ConditionalExcept, d as IsEqual, e as Subtract, f as IsNull, g as IsAny, h as UndefinedToOptional, i as ArrayElement, O as ObjectValue, K as KeysOfUnion, j as IsNotFalse, W as WordSeparators, k as IsNumeric, l as IsLowerCase, m as IsUpperCase, n as UpperCaseCharacters, o as StringDigit } from './conditional-except.d-c99547cb.js';
export { s as ObservableLike, r as Observer, P as PartialDeep, p as PartialDeepOptions, T as Trim, q as Unsubscribable } from './conditional-except.d-c99547cb.js';
import { Writable as Writable$1 } from './writable.js';
export * from 'type-fest/source/async-return-type.js';
export { SimplifyDeep } from 'type-fest/source/merge-deep.js';

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
Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
type Class<T, Arguments extends unknown[] = any[]> = Constructor<T, Arguments> & {prototype: T};

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
type Constructor<T, Arguments extends unknown[] = any[]> = new(...arguments_: Arguments) => T;

/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/classes.html#abstract-classes).

@category Class
*/
type AbstractClass<T, Arguments extends unknown[] = any[]> = AbstractConstructor<T, Arguments> & {prototype: T};

/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html#abstract-construct-signatures) constructor.

@category Class
*/
type AbstractConstructor<T, Arguments extends unknown[] = any[]> = abstract new(...arguments_: Arguments) => T;

/**
Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

@category JSON
*/
type JsonObject = {[Key in string]: JsonValue} & {[Key in string]?: JsonValue | undefined};

/**
Matches a JSON array.

@category JSON
*/
type JsonArray = JsonValue[] | readonly JsonValue[];

/**
Matches any valid JSON primitive value.

@category JSON
*/
type JsonPrimitive = string | number | boolean | null;

/**
Matches any valid JSON value.

@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.

@category JSON
*/
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

declare const emptyObjectSymbol: unique symbol;

/**
Represents a strictly empty plain object, the `{}` value.

When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).

@example
```
import type {EmptyObject} from 'type-fest';

// The following illustrates the problem with `{}`.
const foo1: {} = {}; // Pass
const foo2: {} = []; // Pass
const foo3: {} = 42; // Pass
const foo4: {} = {a: 1}; // Pass

// With `EmptyObject` only the first case is valid.
const bar1: EmptyObject = {}; // Pass
const bar2: EmptyObject = 42; // Fail
const bar3: EmptyObject = []; // Fail
const bar4: EmptyObject = {a: 1}; // Fail
```

Unfortunately, `Record<string, never>`, `Record<keyof any, never>` and `Record<never, never>` do not work. See {@link https://github.com/sindresorhus/type-fest/issues/395 #395}.

@category Object
*/
type EmptyObject = {[emptyObjectSymbol]?: never};

/**
Returns a `boolean` for whether the type is strictly equal to an empty plain object, the `{}` value.

@example
```
import type {IsEmptyObject} from 'type-fest';

type Pass = IsEmptyObject<{}>; //=> true
type Fail = IsEmptyObject<[]>; //=> false
type Fail = IsEmptyObject<null>; //=> false
```

@see EmptyObject
@category Object
*/
type IsEmptyObject<T> = T extends EmptyObject ? true : false;

/**
Create a union of types that share a common discriminant property.

Use-case: A shorter way to declare tagged unions with multiple members.

@example
```
import type {TaggedUnion} from 'type-fest';

type Tagged<Fields extends Record<string, unknown> = TaggedUnion<'type', Fields>

// The TaggedUnion utility reduces the amount of boilerplate needed to create a tagged union with multiple members, making the code more concise.
type EventMessage = Tagged<{
	OpenExternalUrl: {
		url: string;
		id: number;
		language: string;
	};
	ToggleBackButtonVisibility: {
		visible: boolean;
	};
	PurchaseButtonPressed: {
		price: number;
		time: Date;
	};
	NavigationStateChanged: {
		navigation?: string;
	};
}>;

// Here is the same type created without this utility.
type EventMessage =
	| {
		type: 'OpenExternalUrl';
		url: string;
		id: number;
		language: string;
	}
	| {type: 'ToggleBackButtonVisibility'; visible: boolean}
	| {type: 'PurchaseButtonPressed'; price: number; time: Date}
	| {type: 'NavigationStateChanged'; navigation?: string};
```

@category Utilities
*/
type TaggedUnion<
	TagKey extends string,
	UnionMembers extends Record<string, Record<string, unknown>>,
> = {
	[Name in keyof UnionMembers]: {[Key in TagKey]: Name} & UnionMembers[Name];
}[keyof UnionMembers];

/**
Create a type that strips `readonly` from all or some of an object's keys. Inverse of `Readonly<T>`.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {Writable} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that only the mutability status of the properties, not their values, are affected.
	readonly c: boolean;
};

const writableFoo: Writable<Foo> = {a: 1, b: ['2'], c: true};
writableFoo.a = 3;
writableFoo.b[0] = 'new value'; // Will still fail as the value of property "b" is still a readonly type.
writableFoo.b = ['something']; // Will work as the "b" property itself is no longer readonly.

type SomeWritable = Writable<Foo, 'b' | 'c'>;
// type SomeWritable = {
// 	readonly a: number;
// 	b: readonly string[]; // It's now writable. The type of the property remains unaffected.
// 	c: boolean; // It's now writable.
// }
```

@category Object
*/
type Writable<BaseType, Keys extends keyof BaseType = keyof BaseType> =
	Simplify<
	// Pick just the keys that are not writable from the base type.
	Except<BaseType, Keys> &
	// Pick the keys that should be writable from the base type and make them writable by removing the `readonly` modifier from the key.
	{-readonly [KeyType in keyof Pick<BaseType, Keys>]: Pick<BaseType, Keys>[KeyType]}
	>;

/**
Create a deeply mutable version of an `object`/`ReadonlyMap`/`ReadonlySet`/`ReadonlyArray` type. The inverse of `ReadonlyDeep<T>`. Use `Writable<T>` if you only need one level deep.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509), or to define a single model where the only thing that changes is whether or not some of the keys are writable.

@example
```
import type {WritableDeep} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[]; // To show that mutability is deeply affected.
	readonly c: boolean;
};

const writableDeepFoo: WritableDeep<Foo> = {a: 1, b: ['2'], c: true};
writableDeepFoo.a = 3;
writableDeepFoo.b[0] = 'new value';
writableDeepFoo.b = ['something'];
```

Note that types containing overloaded functions are not made deeply writable due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@see Writable
@category Object
@category Array
@category Set
@category Map
*/
type WritableDeep<T> = T extends BuiltIns
	? T
	: T extends (...arguments: any[]) => unknown
		? {} extends WritableObjectDeep<T>
			? T
			: HasMultipleCallSignatures<T> extends true
				? T
				: ((...arguments: Parameters<T>) => ReturnType<T>) & WritableObjectDeep<T>
		: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
			? WritableMapDeep<KeyType, ValueType>
			: T extends Readonly<ReadonlySet<infer ItemType>>
				? WritableSetDeep<ItemType>
				: T extends object
					? WritableObjectDeep<T>
					: unknown;

/**
Same as `WritableDeep`, but accepts only `Map`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableMapDeep<KeyType, ValueType> = {} & Writable$1<Map<WritableDeep<KeyType>, WritableDeep<ValueType>>>;

/**
Same as `WritableDeep`, but accepts only `Set`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableSetDeep<ItemType> = {} & Writable$1<Set<WritableDeep<ItemType>>>;

/**
Same as `WritableDeep`, but accepts only `object`s as inputs. Internal helper for `WritableDeep`.
*/
type WritableObjectDeep<ObjectType extends object> = {
	-readonly [KeyType in keyof ObjectType]: WritableDeep<ObjectType[KeyType]>
};

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
Pick only index signatures from the given object type, leaving out all explicitly defined properties.

This is the counterpart of `OmitIndexSignature`.

When you use a type that will iterate through an object that has indexed keys and explicitly defined keys you end up with a type where only the indexed keys are kept. This is because `keyof` of an indexed type always returns `string | number | symbol`, because every key is possible in that object. With this type, you can save the indexed keys and reinject them later, like in the second example below.

@example
```
import type {PickIndexSignature} from 'type-fest';

declare const symbolKey: unique symbol;

type Example = {
	// These index signatures will remain.
	[x: string]: unknown;
	[x: number]: unknown;
	[x: symbol]: unknown;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;

	// These explicitly defined keys will be removed.
	['snake-case-key']: string;
	[symbolKey]: string;
	foo: 'bar';
	qux?: 'baz';
};

type ExampleIndexSignature = PickIndexSignature<Example>;
// {
// 	[x: string]: unknown;
// 	[x: number]: unknown;
// 	[x: symbol]: unknown;
// 	[x: `head-${string}`]: string;
// 	[x: `${string}-tail`]: string;
// 	[x: `head-${string}-tail`]: string;
// 	[x: `${bigint}`]: string;
// 	[x: `embedded-${number}`]: string;
// }
```

@example
```
import type {OmitIndexSignature, PickIndexSignature, Simplify} from 'type-fest';

type Foo = {
	[x: string]: string;
	foo: string;
	bar: number;
};

// Imagine that you want a new type `Bar` that comes from `Foo`.
// => {
// 	[x: string]: string;
// 	bar: number;
// };

type Bar = Omit<Foo, 'foo'>;
// This is not working because `Omit` returns only indexed keys.
// => {
// 	[x: string]: string;
// 	[x: number]: string;
// }

// One solution is to save the indexed signatures to new type.
type FooIndexSignature = PickIndexSignature<Foo>;
// => {
// 	[x: string]: string;
// }

// Get a new type without index signatures.
type FooWithoutIndexSignature = OmitIndexSignature<Foo>;
// => {
// 	foo: string;
// 	bar: number;
// }

// At this point we can use Omit to get our new type.
type BarWithoutIndexSignature = Omit<FooWithoutIndexSignature, 'foo'>;
// => {
// 	bar: number;
// }

// And finally we can merge back the indexed signatures.
type BarWithIndexSignature = Simplify<BarWithoutIndexSignature & FooIndexSignature>;
// => {
// 	[x: string]: string;
// 	bar: number;
// }
```

@see OmitIndexSignature
@category Object
*/
type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
		? KeyType
		: never]: ObjectType[KeyType];
};

// Returns `never` if the key is optional otherwise return the key type.
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? Key
		: never
	: Key;

// Returns `never` if the key is required otherwise return the key type.
type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? never
		: Key
	: never;

/**
Enforce optional keys (by adding the `?` operator) for keys that have a union with `undefined`.

@example
```
import type {EnforceOptional} from 'type-fest';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type FooBar = EnforceOptional<Foo>;
// => {
// 	a: string;
// 	b?: string;
// 	c: undefined;
// 	d?: number;
// }
```

@internal
@category Object
*/
type EnforceOptional<ObjectType> = Simplify<{
	[Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key]
} & {
	[Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>
}>;

// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

@example
```
import type {Merge} from 'type-fest';

interface Foo {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
}

type Bar = {
	[x: number]: number;
	[x: symbol]: unknown;
	bar: Date;
	baz: boolean;
};

export type FooBar = Merge<Foo, Bar>;
// => {
// 	[x: string]: unknown;
// 	[x: number]: number;
// 	[x: symbol]: unknown;
// 	foo: string;
// 	bar: Date;
// 	baz: boolean;
// }
```

@category Object
*/
type Merge<Destination, Source> = EnforceOptional<
SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>>;

/**
Recursively simplifies a type while including and/or excluding certain types from being simplified.

This type is **experimental** and was introduced as a result of this {@link https://github.com/sindresorhus/type-fest/issues/436 issue}. It should be used with caution.

See {@link ConditionalSimplify} for usages and examples.

@internal
@experimental
@category Object
*/
type ConditionalSimplifyDeep<Type, ExcludeType = never, IncludeType = unknown> = Type extends ExcludeType
	? Type
	: Type extends IncludeType
		? {[TypeKey in keyof Type]: ConditionalSimplifyDeep<Type[TypeKey], ExcludeType, IncludeType>}
		: Type;

/**
Deeply simplifies an object excluding iterables and functions. Used internally to improve the UX and accept both interfaces and type aliases as inputs.
*/
type SimplifyDeep<Type> = ConditionalSimplifyDeep<Type, Function | Iterable<unknown>, object>;

/**
Try to merge two record properties or return the source property value, preserving `undefined` properties values in both cases.
*/
type MergeDeepRecordProperty<
	Destination,
	Source,
	Options extends MergeDeepInternalOptions,
> = undefined extends Source
	? MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, Options> | undefined
	: MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
- If the source does not contain the key, the value of the destination is returned.
- If the source contains the key and the destination does not contain the key, the value of the source is returned.
- If both contain the key, try to merge according to the chosen {@link MergeDeepOptions options} or return the source if unable to merge.
*/
type DoMergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepInternalOptions,
> = EnforceOptional<{
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Key extends keyof Destination
			? MergeDeepRecordProperty<Destination[Key], Source[Key], Options>
			: Source[Key]
		: Key extends keyof Destination
			? Destination[Key]
			: never;
}>;

/**
Wrapper around {@link DoMergeDeepRecord} which preserves index signatures.
*/
type MergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepInternalOptions,
> = DoMergeDeepRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, Options>
& Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

/**
Pick the rest type.

@example
```
type Rest1 = PickRestType<[]>; // => []
type Rest2 = PickRestType<[string]>; // => []
type Rest3 = PickRestType<[...number[]]>; // => number[]
type Rest4 = PickRestType<[string, ...number[]]>; // => number[]
type Rest5 = PickRestType<string[]>; // => string[]
```
*/
type PickRestType<Type extends UnknownArrayOrTuple> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Type : PickRestType<ArrayTail<Type>>
	: [];

/**
Omit the rest type.

@example
```
type Tuple1 = OmitRestType<[]>; // => []
type Tuple2 = OmitRestType<[string]>; // => [string]
type Tuple3 = OmitRestType<[...number[]]>; // => []
type Tuple4 = OmitRestType<[string, ...number[]]>; // => [string]
type Tuple5 = OmitRestType<[string, boolean[], ...number[]]>; // => [string, boolean[]]
type Tuple6 = OmitRestType<string[]>; // => []
```
*/
type OmitRestType<Type extends UnknownArrayOrTuple, Result extends UnknownArrayOrTuple = []> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Result : OmitRestType<ArrayTail<Type>, [...Result, FirstArrayElement<Type>]>
	: Type;

// Utility to avoid picking two times the type.
type TypeNumberOrType<Type extends UnknownArrayOrTuple> = Type[number] extends never ? Type : Type[number];

// Pick the rest type (array) and try to get the intrinsic type or return the provided type.
type PickRestTypeFlat<Type extends UnknownArrayOrTuple> = TypeNumberOrType<PickRestType<Type>>;

/**
Try to merge two array/tuple elements or return the source element if the end of the destination is reached or vis-versa.
*/
type MergeDeepArrayOrTupleElements<
	Destination,
	Source,
	Options extends MergeDeepInternalOptions,
> = Source extends []
	? Destination
	: Destination extends []
		? Source
		: MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Merge two tuples recursively.
*/
type DoMergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	DestinationRestType,
	SourceRestType,
	Options extends MergeDeepInternalOptions,
> = Destination extends []
	? Source extends []
		? []
		: MergeArrayTypeAndTuple<DestinationRestType, Source, Options>
	: Source extends []
		? MergeTupleAndArrayType<Destination, SourceRestType, Options>
		: [
			MergeDeepArrayOrTupleElements<FirstArrayElement<Destination>, FirstArrayElement<Source>, Options>,
			...DoMergeDeepTupleAndTupleRecursive<ArrayTail<Destination>, ArrayTail<Source>, DestinationRestType, SourceRestType, Options>,
		];

/**
Merge two tuples recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = [
	...DoMergeDeepTupleAndTupleRecursive<OmitRestType<Destination>, OmitRestType<Source>, PickRestTypeFlat<Destination>, PickRestTypeFlat<Source>, Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
];

/**
Merge an array type with a tuple recursively.
*/
type MergeTupleAndArrayType<
	Tuple extends UnknownArrayOrTuple,
	ArrayType,
	Options extends MergeDeepInternalOptions,
> = Tuple extends []
	? Tuple
	: [
		MergeDeepArrayOrTupleElements<FirstArrayElement<Tuple>, ArrayType, Options>,
		...MergeTupleAndArrayType<ArrayTail<Tuple>, ArrayType, Options>,
	];

/**
Merge an array into a tuple recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = [
	...MergeTupleAndArrayType<OmitRestType<Destination>, Source[number], Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
];

/**
Merge a tuple with an array type recursively.
*/
type MergeArrayTypeAndTuple<
	ArrayType,
	Tuple extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = Tuple extends []
	? Tuple
	: [
		MergeDeepArrayOrTupleElements<ArrayType, FirstArrayElement<Tuple>, Options>,
		...MergeArrayTypeAndTuple<ArrayType, ArrayTail<Tuple>, Options>,
	];

/**
Merge a tuple into an array recursively taking into account a possible rest element.
*/
type MergeDeepArrayAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = [
	...MergeArrayTypeAndTuple<Destination[number], OmitRestType<Source>, Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
];

/**
Merge mode for array/tuple elements.
*/
type ArrayMergeMode = 'spread' | 'replace';

/**
Test if it should spread top-level arrays.
*/
type ShouldSpread<Options extends MergeDeepInternalOptions> = Options['spreadTopLevelArrays'] extends false
	? Options['arrayMergeMode'] extends 'spread' ? true : false
	: true;

/**
Merge two arrays/tuples according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option.
*/
type DoMergeArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = ShouldSpread<Options> extends true
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Source; // 'replace'

/**
Merge two arrays recursively.

If the two arrays are multi-level, we merge deeply, otherwise we merge the first level only.

Note: The `[number]` accessor is used to test the type of the second level.
*/
type MergeDeepArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = Destination[number] extends UnknownArrayOrTuple
	? Source[number] extends UnknownArrayOrTuple
		? Array<MergeDeepArrayOrTupleRecursive<Destination[number], Source[number], Options>>
		: DoMergeArrayOrTuple<Destination, Source, Options>
	: Destination[number] extends UnknownRecord
		? Source[number] extends UnknownRecord
			? Array<SimplifyDeep<MergeDeepRecord<Destination[number], Source[number], Options>>>
			: DoMergeArrayOrTuple<Destination, Source, Options>
		: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Merge two array/tuple recursively by selecting one of the four strategies according to the type of inputs.

- tuple/tuple
- tuple/array
- array/tuple
- array/array
*/
type MergeDeepArrayOrTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = IsBothExtends<NonEmptyTuple, Destination, Source> extends true
	? MergeDeepTupleAndTupleRecursive<Destination, Source, Options>
	: Destination extends NonEmptyTuple
		? MergeDeepTupleAndArrayRecursive<Destination, Source, Options>
		: Source extends NonEmptyTuple
			? MergeDeepArrayAndTupleRecursive<Destination, Source, Options>
			: MergeDeepArrayRecursive<Destination, Source, Options>;

/**
Merge two array/tuple according to {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option.
*/
type MergeDeepArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepInternalOptions,
> = Options['recurseIntoArrays'] extends true
	? MergeDeepArrayOrTupleRecursive<Destination, Source, Options>
	: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Try to merge two objects or two arrays/tuples recursively into a new type or return the default value.
*/
type MergeDeepOrReturn<
	DefaultType,
	Destination,
	Source,
	Options extends MergeDeepInternalOptions,
> = SimplifyDeep<[undefined] extends [Destination | Source]
	? DefaultType
	: Destination extends UnknownRecord
		? Source extends UnknownRecord
			? MergeDeepRecord<Destination, Source, Options>
			: DefaultType
		: Destination extends UnknownArrayOrTuple
			? Source extends UnknownArrayOrTuple
				? MergeDeepArrayOrTuple<Destination, Source, Merge<Options, {spreadTopLevelArrays: false}>>
				: DefaultType
			: DefaultType>;

/**
MergeDeep options.

@see {@link MergeDeep}
*/
type MergeDeepOptions = {
	/**
	Merge mode for array and tuple.

	When we walk through the properties of the objects and the same key is found and both are array or tuple, a merge mode must be chosen:
	- `replace`: Replaces the destination value by the source value. This is the default mode.
	- `spread`: Spreads the destination and the source values.

	See {@link MergeDeep} for usages and examples.

	Note: Top-level arrays and tuples are always spread.

	@default 'spread'
	*/
	arrayMergeMode?: ArrayMergeMode;

	/**
	Whether to affect the individual elements of arrays and tuples.

	If this option is set to `true` the following rules are applied:
	- If the source does not contain the key, the value of the destination is returned.
	- If the source contains the key and the destination does not contain the key, the value of the source is returned.
	- If both contain the key, try to merge according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} or return the source if unable to merge.

	@default false
	*/
	recurseIntoArrays?: boolean;
};

/**
Internal options.
*/
type MergeDeepInternalOptions = Merge<MergeDeepOptions, {spreadTopLevelArrays?: boolean}>;

/**
Merge default and internal options with user provided options.
*/
type DefaultMergeDeepOptions<Options extends MergeDeepOptions> = Merge<{
	arrayMergeMode: 'replace';
	recurseIntoArrays: false;
	spreadTopLevelArrays: true;
}, Options>;

/**
This utility selects the correct entry point with the corresponding default options. This avoids re-merging the options at each iteration.
*/
type MergeDeepWithDefaultOptions<Destination, Source, Options extends MergeDeepOptions> = SimplifyDeep<
[undefined] extends [Destination | Source]
	? never
	: Destination extends UnknownRecord
		? Source extends UnknownRecord
			? MergeDeepRecord<Destination, Source, DefaultMergeDeepOptions<Options>>
			: never
		: Destination extends UnknownArrayOrTuple
			? Source extends UnknownArrayOrTuple
				? MergeDeepArrayOrTuple<Destination, Source, DefaultMergeDeepOptions<Options>>
				: never
			: never
>;

/**
Merge two objects or two arrays/tuples recursively into a new type.

- Properties that only exist in one object are copied into the new object.
- Properties that exist in both objects are merged if possible or replaced by the one of the source if not.
- Top-level arrays and tuples are always spread.
- By default, inner arrays and tuples are replaced. See {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option to change this behaviour.
- By default, individual array/tuple elements are not affected. See {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option to change this behaviour.

@example
```
import type {MergeDeep} from 'type-fest';

type Foo = {
	life: number;
	items: string[];
	a: {b: string; c: boolean; d: number[]};
};

interface Bar {
	name: string;
	items: number[];
	a: {b: number; d: boolean[]};
}

type FooBar = MergeDeep<Foo, Bar>;
// {
// 	life: number;
// 	name: string;
// 	items: number[];
// 	a: {b: number; c: boolean; d: boolean[]};
// }

type FooBar = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
// {
// 	life: number;
// 	name: string;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean; d: (number | boolean)[]};
// }
```

@example
```
import type {MergeDeep} from 'type-fest';

// Merge two arrays
type ArrayMerge = MergeDeep<string[], number[]>; // => (string | number)[]

// Merge two tuples
type TupleMerge = MergeDeep<[1, 2, 3], ['a', 'b']>; // => (1 | 2 | 3 | 'a' | 'b')[]

// Merge an array into a tuple
type TupleArrayMerge = MergeDeep<[1, 2, 3], string[]>; // => (string | 1 | 2 | 3)[]

// Merge a tuple into an array
type ArrayTupleMerge = MergeDeep<number[], ['a', 'b']>; // => (number | 'b' | 'a')[]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

type Foo = {foo: 'foo'; fooBar: string[]};
type Bar = {bar: 'bar'; fooBar: number[]};

type FooBar = MergeDeep<Foo, Bar>;
// { foo: "foo"; bar: "bar"; fooBar: number[]}

type FooBarSpread = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
// { foo: "foo"; bar: "bar"; fooBar: (string | number)[]}

type FooBarArray = MergeDeep<Foo[], Bar[]>;
// (Foo | Bar)[]

type FooBarArrayDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true}>;
// FooBar[]

type FooBarArraySpreadDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
// FooBarSpread[]

type FooBarTupleDeep = MergeDeep<[Foo, true, 42], [Bar, 'life'], {recurseIntoArrays: true}>;
// [FooBar, 'life', 42]

type FooBarTupleWithArrayDeep = MergeDeep<[Foo[], true], [Bar[], 'life', 42], {recurseIntoArrays: true}>;
// [FooBar[], 'life', 42]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
	destination: Destination,
	source: Source,
	options?: Options,
): MergeDeep<Destination, Source, Options> {
	// Make your implementation ...
}
```

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplifyDeep} which itself is experimental.

@see {@link MergeDeepOptions}

@category Array
@category Object
@category Utilities
*/
type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepWithDefaultOptions<
SimplifyDeep<Destination>,
SimplifyDeep<Source>,
Options
>;

// Helper type. Not useful on its own.
type Without<FirstType, SecondType> = {[KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never};

/**
Create a type that has mutually exclusive keys.

This type was inspired by [this comment](https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604).

This type works with a helper type, called `Without`. `Without<FirstType, SecondType>` produces a type that has only keys from `FirstType` which are not present on `SecondType` and sets the value type for these keys to `never`. This helper type is then used in `MergeExclusive` to remove keys from either `FirstType` or `SecondType`.

@example
```
import type {MergeExclusive} from 'type-fest';

interface ExclusiveVariation1 {
	exclusive1: boolean;
}

interface ExclusiveVariation2 {
	exclusive2: string;
}

type ExclusiveOptions = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

let exclusiveOptions: ExclusiveOptions;

exclusiveOptions = {exclusive1: true};
//=> Works
exclusiveOptions = {exclusive2: 'hi'};
//=> Works
exclusiveOptions = {exclusive1: true, exclusive2: 'hi'};
//=> Error
```

@category Object
*/
type MergeExclusive<FirstType, SecondType> =
	(FirstType | SecondType) extends object ?
		(Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) :
		FirstType | SecondType;

/**
Create a type that requires at least one of the given keys. The remaining keys are kept as is.

@example
```
import type {RequireAtLeastOne} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure?: boolean;
};

const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireAtLeastOne<
	ObjectType,
	KeysType extends keyof ObjectType = keyof ObjectType,
> = {
	// For each `Key` in `KeysType` make a mapped type:
	[Key in KeysType]-?: Required<Pick<ObjectType, Key>> & // 1. Make `Key`'s type required
	// 2. Make all other keys in `KeysType` optional
	Partial<Pick<ObjectType, Exclude<KeysType, Key>>>;
}[KeysType] &
// 3. Add the remaining keys not in `KeysType`
Except<ObjectType, KeysType>;

/**
Create a type that requires exactly one of the given keys and disallows more. The remaining keys are kept as is.

Use-cases:
- Creating interfaces for components that only need one of the keys to display properly.
- Declaring generic keys in a single place for a single use-case that gets narrowed down via `RequireExactlyOne`.

The caveat with `RequireExactlyOne` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireExactlyOne` can't do anything to prevent extra keys it doesn't know about.

@example
```
import type {RequireExactlyOne} from 'type-fest';

type Responder = {
	text: () => string;
	json: () => string;
	secure: boolean;
};

const responder: RequireExactlyOne<Responder, 'text' | 'json'> = {
	// Adding a `text` key here would cause a compile error.

	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireExactlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	{[Key in KeysType]: (
		Required<Pick<ObjectType, Key>> &
		Partial<Record<Exclude<KeysType, Key>, never>>
	)}[KeysType] & Omit<ObjectType, KeysType>;

/**
Create a type that requires all of the given keys or none of the given keys. The remaining keys are kept as is.

Use-cases:
- Creating interfaces for components with mutually-inclusive keys.

The caveat with `RequireAllOrNone` is that TypeScript doesn't always know at compile time every key that will exist at runtime. Therefore `RequireAllOrNone` can't do anything to prevent extra keys it doesn't know about.

@example
```
import type {RequireAllOrNone} from 'type-fest';

type Responder = {
	text?: () => string;
	json?: () => string;
	secure: boolean;
};

const responder1: RequireAllOrNone<Responder, 'text' | 'json'> = {
	secure: true
};

const responder2: RequireAllOrNone<Responder, 'text' | 'json'> = {
	text: () => '{"message": "hi"}',
	json: () => '{"message": "ok"}',
	secure: true
};
```

@category Object
*/
type RequireAllOrNone<ObjectType, KeysType extends keyof ObjectType = never> = (
	| Required<Pick<ObjectType, KeysType>> // Require all of the given keys.
	| Partial<Record<KeysType, never>> // Require none of the given keys.
) &
Omit<ObjectType, KeysType>; // The rest of the keys.

/**
@see PartialOnUndefinedDeep
*/
type PartialOnUndefinedDeepOptions = {
	/**
	Whether to affect the individual elements of arrays and tuples.

	@default false
	*/
	readonly recurseIntoArrays?: boolean;
};

/**
Create a deep version of another type where all keys accepting `undefined` type are set to optional.

This utility type is recursive, transforming at any level deep. By default, it does not affect arrays and tuples items unless you explicitly pass `{recurseIntoArrays: true}` as the second type argument.

Use-cases:
- Make all properties of a type that can be undefined optional to not have to specify keys with undefined value.

@example
```
import type {PartialOnUndefinedDeep} from 'type-fest';

interface Settings {
	optionA: string;
	optionB: number | undefined;
	subOption: {
		subOptionA: boolean;
		subOptionB: boolean | undefined;
	}
};

const testSettings: PartialOnUndefinedDeep<Settings> = {
	optionA: 'foo',
	// 👉 optionB is now optional and can be omitted
	subOption: {
		subOptionA: true,
		// 👉 subOptionB is now optional as well and can be omitted
	},
};
```

@category Object
*/
type PartialOnUndefinedDeep<T, Options extends PartialOnUndefinedDeepOptions = {}> = T extends Record<any, any> | undefined
	? {[KeyType in keyof T as undefined extends T[KeyType] ? KeyType : never]?: PartialOnUndefinedDeepValue<T[KeyType], Options>} extends infer U // Make a partial type with all value types accepting undefined (and set them optional)
		? Merge<{[KeyType in keyof T as KeyType extends keyof U ? never : KeyType]: PartialOnUndefinedDeepValue<T[KeyType], Options>}, U> // Join all remaining keys not treated in U
		: never // Should not happen
	: T;

/**
Utility type to get the value type by key and recursively call `PartialOnUndefinedDeep` to transform sub-objects.
*/
type PartialOnUndefinedDeepValue<T, Options extends PartialOnUndefinedDeepOptions> = T extends BuiltIns | ((...arguments: any[]) => unknown)
	? T
	: T extends ReadonlyArray<infer U> // Test if type is array or tuple
		? Options['recurseIntoArrays'] extends true // Check if option is activated
			? U[] extends T // Check if array not tuple
				? readonly U[] extends T
					? ReadonlyArray<PartialOnUndefinedDeep<U, Options>> // Readonly array treatment
					: Array<PartialOnUndefinedDeep<U, Options>> // Mutable array treatment
				: PartialOnUndefinedDeep<{[Key in keyof T]: PartialOnUndefinedDeep<T[Key], Options>}, Options> // Tuple treatment
			: T
		: T extends Record<any, any> | undefined
			? PartialOnUndefinedDeep<T, Options>
			: unknown;

/**
Convert `object`s, `Map`s, `Set`s, and `Array`s and all of their keys/elements into immutable structures recursively.

This is useful when a deeply nested structure needs to be exposed as completely immutable, for example, an imported JSON module or when receiving an API response that is passed around.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/13923) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
	"foo": ["bar"]
}

// main.ts
import type {ReadonlyDeep} from 'type-fest';
import dataJson = require('./data.json');

const data: ReadonlyDeep<typeof dataJson> = dataJson;

export default data;

// test.ts
import data from './main';

data.foo.push('bar');
//=> error TS2339: Property 'push' does not exist on type 'readonly string[]'
```

Note that types containing overloaded functions are not made deeply readonly due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Object
@category Array
@category Set
@category Map
*/
type ReadonlyDeep<T> = T extends BuiltIns
	? T
	: T extends (...arguments: any[]) => unknown
		? {} extends ReadonlyObjectDeep<T>
			? T
			: HasMultipleCallSignatures<T> extends true
				? T
				: ((...arguments: Parameters<T>) => ReturnType<T>) & ReadonlyObjectDeep<T>
		: T extends Readonly<ReadonlyMap<infer KeyType, infer ValueType>>
			? ReadonlyMapDeep<KeyType, ValueType>
			: T extends Readonly<ReadonlySet<infer ItemType>>
				? ReadonlySetDeep<ItemType>
				: T extends object
					? ReadonlyObjectDeep<T>
					: unknown;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlyMapDeep<KeyType, ValueType> = {} & Readonly<ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;

/**
Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlySetDeep<ItemType> = {} & Readonly<ReadonlySet<ReadonlyDeep<ItemType>>>;

/**
Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
*/
type ReadonlyObjectDeep<ObjectType extends object> = {
	readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>
};

/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.

Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It will be removed as soon as it's not needed anymore.

@example
```
import type {LiteralUnion} from 'type-fest';

// Before

type Pet = 'dog' | 'cat' | string;

const pet: Pet = '';
// Start typing in your TypeScript-enabled IDE.
// You **will not** get auto-completion for `dog` and `cat` literals.

// After

type Pet2 = LiteralUnion<'dog' | 'cat', string>;

const pet: Pet2 = '';
// You **will** get auto-completion for `dog` and `cat` literals.
```

@category Type
*/
type LiteralUnion<
	LiteralType,
	BaseType extends Primitive$1,
> = LiteralType | (BaseType & Record<never, never>);

/**
Create a type that represents either the value or the value wrapped in `PromiseLike`.

Use-cases:
- A function accepts a callback that may either return a value synchronously or may return a promised value.
- This type could be the return type of `Promise#then()`, `Promise#catch()`, and `Promise#finally()` callbacks.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31394) if you want to have this type as a built-in in TypeScript.

@example
```
import type {Promisable} from 'type-fest';

async function logger(getLogEntry: () => Promisable<string>): Promise<void> {
	const entry = await getLogEntry();
	console.log(entry);
}

logger(() => 'foo');
logger(() => Promise.resolve('bar'));
```

@category Async
*/
type Promisable<T> = T | PromiseLike<T>;

declare const tag: unique symbol;

declare type Tagged<Token> = {
	readonly [tag]: Token;
};

/**
Create an opaque type, which hides its internal details from the public, and can only be created by being used explicitly.

The generic type parameter can be anything. It doesn't have to be an object.

[Read more about opaque types.](https://codemix.com/opaque-types-in-javascript/)

There have been several discussions about adding this feature to TypeScript via the `opaque type` operator, similar to how Flow does it. Unfortunately, nothing has (yet) moved forward:
	- [Microsoft/TypeScript#202](https://github.com/microsoft/TypeScript/issues/202)
	- [Microsoft/TypeScript#15408](https://github.com/Microsoft/TypeScript/issues/15408)
	- [Microsoft/TypeScript#15807](https://github.com/Microsoft/TypeScript/issues/15807)

@example
```
import type {Opaque} from 'type-fest';

type AccountNumber = Opaque<number, 'AccountNumber'>;
type AccountBalance = Opaque<number, 'AccountBalance'>;

// The `Token` parameter allows the compiler to differentiate between types, whereas "unknown" will not. For example, consider the following structures:
type ThingOne = Opaque<string>;
type ThingTwo = Opaque<string>;

// To the compiler, these types are allowed to be cast to each other as they have the same underlying type. They are both `string & { __opaque__: unknown }`.
// To avoid this behaviour, you would instead pass the "Token" parameter, like so.
type NewThingOne = Opaque<string, 'ThingOne'>;
type NewThingTwo = Opaque<string, 'ThingTwo'>;

// Now they're completely separate types, so the following will fail to compile.
function createNewThingOne (): NewThingOne {
	// As you can see, casting from a string is still allowed. However, you may not cast NewThingOne to NewThingTwo, and vice versa.
	return 'new thing one' as NewThingOne;
}

// This will fail to compile, as they are fundamentally different types.
const thingTwo = createNewThingOne() as NewThingTwo;

// Here's another example of opaque typing.
function createAccountNumber(): AccountNumber {
	return 2 as AccountNumber;
}

function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance {
	return 4 as AccountBalance;
}

// This will compile successfully.
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an `AccountNumber` type.
getMoneyForAccount(2);

// You can use opaque values like they aren't opaque too.
const accountNumber = createAccountNumber();

// This will not compile successfully.
const newAccountNumber = accountNumber + 2;

// As a side note, you can (and should) use recursive types for your opaque types to make them stronger and hopefully easier to type.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
```

@category Type
*/
type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

/**
Revert an opaque type back to its original type by removing the readonly `[tag]`.

Why is this necessary?

1. Use an `Opaque` type as object keys
2. Prevent TS4058 error: "Return type of exported function has or is using name X from external module Y but cannot be named"

@example
```
import type {Opaque, UnwrapOpaque} from 'type-fest';

type AccountType = Opaque<'SAVINGS' | 'CHECKING', 'AccountType'>;

const moneyByAccountType: Record<UnwrapOpaque<AccountType>, number> = {
	SAVINGS: 99,
	CHECKING: 0.1
};

// Without UnwrapOpaque, the following expression would throw a type error.
const money = moneyByAccountType.SAVINGS; // TS error: Property 'SAVINGS' does not exist

// Attempting to pass an non-Opaque type to UnwrapOpaque will raise a type error.
type WontWork = UnwrapOpaque<string>;
```

@category Type
*/
type UnwrapOpaque<OpaqueType extends Tagged<unknown>> =
	OpaqueType extends Opaque<infer Type, OpaqueType[typeof tag]>
		? Type
		: OpaqueType;

/**
Create an [invariant type](https://basarat.gitbook.io/typescript/type-system/type-compatibility#footnote-invariance), which is a type that does not accept supertypes and subtypes.

Use-case:
- Prevent runtime errors that may occur due to assigning subtypes to supertypes.
- Improve type signature of object methods like [`Object.keys()` or `Object.entries()`](https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208) by sealing the object type.

@example
```
import type {InvariantOf} from 'type-fest';

class Animal {
	constructor(public name: string){}
}

class Cat extends Animal {
	meow() {}
}

let animalArray: Animal[] = [animal];
let catArray: Cat[] = [cat];

animalArray = catArray; // Okay if covariant
animalArray.push(new Animal('another animal')); // Pushed an animal into catArray
catArray.forEach(c => c.meow()); // Allowed but, error at runtime

let invariantAnimalArray: InvariantOf<Animal>[] = [animal] as InvariantOf<Animal>[];
let invariantCatArray: InvariantOf<Cat>[] = [cat] as InvariantOf<Cat>[];

invariantAnimalArray = invariantCatArray; // Error: Type 'InvariantOf<Cat>[]' is not assignable to type 'InvariantOf<Animal>[]'.
```

@example
```
import type {InvariantOf} from 'type-fest';

// In covariance (default)

interface FooBar {
	foo: number;
	bar: string
}

interface FooBarBaz extends FooBar {
	baz: boolean
}

declare const fooBar: FooBar
declare const fooBarBaz: FooBarBaz

function keyOfFooBar(fooBar: FooBar) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfFooBar(fooBar) //=> (keyof FooBar)[]
keyOfFooBar(fooBarBaz) //=> (keyof FooBar)[] but, (keyof FooBarBaz)[] at runtime

// In invariance

export function invariantOf<Type>(value: Type): InvariantOf<Type> {
	return value as InvariantOf<Type>;
}

function keyOfInvariantFooBar(fooBar: InvariantOf<FooBar>) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfInvariantFooBar(invariantOf(fooBar)); // (keyof FooBar)[]
keyOfInvariantFooBar(invariantOf(fooBarBaz)); // Error: Argument of type 'InvariantOf<FooBarBaz>' is not assignable to parameter of type 'InvariantOf<FooBar>'.
```

@category Type
*/
type InvariantOf<Type> = Opaque<Type, (argument: Type) => Type>;

/**
Create a type that makes the given keys optional. The remaining keys are kept as is. The sister of the `SetRequired` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are optional.

@example
```
import type {SetOptional} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
	c: boolean;
}

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
// type SomeOptional = {
// 	a: number;
// 	b?: string; // Was already optional and still is.
// 	c?: boolean; // Is now optional.
// }
```

@category Object
*/
type SetOptional<BaseType, Keys extends keyof BaseType> =
	Simplify<
	// Pick just the keys that are readonly from the base type.
	Except<BaseType, Keys> &
	// Pick the keys that should be mutable from the base type and make them mutable.
	Partial<Pick<BaseType, Keys>>
	>;

/**
Create a type that makes the given keys required. The remaining keys are kept as is. The sister of the `SetOptional` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import type {SetRequired} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
}

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // Was already required and still is.
// 	c: boolean; // Is now required.
// }
```

@category Object
*/
type SetRequired<BaseType, Keys extends keyof BaseType> =
	Simplify<
	BaseType &
	// Pick the keys that should be required from the base type and make them required.
	Required<Pick<BaseType, Keys>>
	>;

/**
Create a type that makes the given keys non-nullable, where the remaining keys are kept as is.

If no keys are given, all keys will be made non-nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are non-nullable.

@example
```
import type {SetNonNullable} from 'type-fest';

type Foo = {
	a: number | null;
	b: string | undefined;
	c?: boolean | null;
}

type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c'>;
// type SomeNonNullable = {
// 	a: number | null;
// 	b: string; // Can no longer be undefined.
// 	c?: boolean; // Can no longer be null, but is still optional.
// }

type AllNonNullable = SetNonNullable<Foo>;
// type AllNonNullable = {
// 	a: number; // Can no longer be null.
// 	b: string; // Can no longer be undefined.
// 	c?: boolean; // Can no longer be null, but is still optional.
// }
```

@category Object
*/
type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
	[Key in keyof BaseType]: Key extends Keys
		? NonNullable<BaseType[Key]>
		: BaseType[Key];
};

type AsyncFunction = (...arguments_: any[]) => Promise<unknown>;

/**
Unwrap the return type of a function that returns a `Promise`.

There has been [discussion](https://github.com/microsoft/TypeScript/pull/35998) about implementing this type in TypeScript.

@example
```ts
import type {AsyncReturnType} from 'type-fest';
import {asyncFunction} from 'api';

// This type resolves to the unwrapped return type of `asyncFunction`.
type Value = AsyncReturnType<typeof asyncFunction>;

async function doSomething(value: Value) {}

asyncFunction().then(value => doSomething(value));
```

@category Async
*/
type AsyncReturnType<Target extends AsyncFunction> = Awaited<ReturnType<Target>>;

/**
Pick keys from the shape that matches the given `Condition`.

This is useful when you want to create a new type from a specific subset of an existing type. For example, you might want to pick all the primitive properties from a class and form a new automatically derived type.

@example
```
import type {Primitive, ConditionalPick} from 'type-fest';

class Awesome {
	name: string;
	successes: number;
	failures: bigint;

	run() {}
}

type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
//=> {name: string; successes: number; failures: bigint}
```

@example
```
import type {ConditionalPick} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

@category Object
*/
type ConditionalPick<Base, Condition> = Pick<
Base,
ConditionalKeys<Base, Condition>
>;

/**
Used to mark properties that should be excluded.
*/
type ConditionalPickDeepSymbol = Opaque<symbol, 'conditional-pick-deep-symbol'>;

/**
Assert the condition according to the {@link ConditionalPickDeepOptions.condition|condition} option.
*/
type AssertCondition<Type, Condition, Options extends ConditionalPickDeepOptions> = Options['condition'] extends 'equality'
	? IsEqual<Type, Condition>
	: Type extends Condition
		? true
		: false;

/**
ConditionalPickDeep options.

@see ConditionalPickDeep
*/
type ConditionalPickDeepOptions = {
	/**
	The condition assertion mode.

	@default 'extends'
	*/
	condition?: 'extends' | 'equality';
};

/**
Pick keys recursively from the shape that matches the given condition.

@see ConditionalPick

@example
```
import type {ConditionalPickDeep} from 'type-fest';

interface Example {
	a: string;
	b: string | boolean;
	c: {
		d: string;
		e: {
			f?: string;
			g?: boolean;
			h: string | boolean;
			i: boolean | bigint;
		};
		j: boolean;
	};
}

type StringPick = ConditionalPickDeep<Example, string>;
//=> {a: string; c: {d: string}}

type StringPickOptional = ConditionalPickDeep<Example, string | undefined>;
//=> {a: string; c: {d: string; e: {f?: string}}}

type StringPickOptionalOnly = ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
//=> {c: {e: {f?: string}}}

type BooleanPick = ConditionalPickDeep<Example, boolean | undefined>;
//=> {c: {e: {g?: boolean}; j: boolean}}

type NumberPick = ConditionalPickDeep<Example, number>;
//=> {}

type StringOrBooleanPick = ConditionalPickDeep<Example, string | boolean>;
//=> {
// 	a: string;
// 	b: string | boolean;
// 	c: {
// 		d: string;
// 		e: {
// 			h: string | boolean
// 		};
// 		j: boolean;
// 	};
// }

type StringOrBooleanPickOnly = ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
//=> {b: string | boolean; c: {e: {h: string | boolean}}}
```

@category Object
*/
type ConditionalPickDeep<
	Type,
	Condition,
	Options extends ConditionalPickDeepOptions = {},
> = ConditionalSimplifyDeep<ConditionalExcept<{
	[Key in keyof Type]: AssertCondition<Type[Key], Condition, Options> extends true
		? Type[Key]
		: Type[Key] extends object
			? ConditionalPickDeep<Type[Key], Condition, Options>
			: ConditionalPickDeepSymbol;
}, (ConditionalPickDeepSymbol | undefined) | Record<PropertyKey, never>>>;

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

/**
Create a type with the keys of the given type changed to `string` type.

Use-case: Changing interface values to strings in order to use them in a form model.

@example
```
import type {Stringified} from 'type-fest';

type Car = {
	model: string;
	speed: number;
}

const carForm: Stringified<Car> = {
	model: 'Foo',
	speed: '101'
};
```

@category Object
*/
type Stringified<ObjectType> = {[KeyType in keyof ObjectType]: string};

/**
Methods to exclude.
*/
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

/**
Create a type that represents an array of the given type and length. The array's length and the `Array` prototype methods that manipulate its length are excluded in the resulting type.

Please participate in [this issue](https://github.com/microsoft/TypeScript/issues/26223) if you want to have a similar type built into TypeScript.

Use-cases:
- Declaring fixed-length tuples or arrays with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating an array of coordinates with a static length, for example, length of 3 for a 3D vector.

Note: This type does not prevent out-of-bounds access. Prefer `ReadonlyTuple` unless you need mutability.

@example
```
import type {FixedLengthArray} from 'type-fest';

type FencingTeam = FixedLengthArray<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@category Array
@see ReadonlyTuple
*/
type FixedLengthArray<Element, Length extends number, ArrayPrototype = [Element, ...Element[]]> = Pick<
ArrayPrototype,
Exclude<keyof ArrayPrototype, ArrayLengthMutationKeys>
> & {
	[index: number]: Element;
	[Symbol.iterator]: () => IterableIterator<Element>;
	readonly length: Length;
};

type Recursive$1<T> = Array<Recursive$1<T>>;

/**
Creates a type that represents a multidimensional array of the given type and dimension.

Use-cases:
- Return a n-dimensional array from functions.
- Declare a n-dimensional array by defining its dimensions rather than declaring `[]` repetitively.
- Infer the dimensions of a n-dimensional array automatically from function arguments.
- Avoid the need to know in advance the dimensions of a n-dimensional array allowing them to be dynamic.

@example
```
import type {MultidimensionalArray} from 'type-fest';

function emptyMatrix<T extends number>(dimensions: T): MultidimensionalArray<unknown, T> {
	const matrix: unknown[] = [];

	let subMatrix = matrix;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		console.log(`Initializing dimension #${dimension}`);

		subMatrix[0] = [];
		subMatrix = subMatrix[0] as unknown[];
	}

	return matrix as MultidimensionalArray<unknown, T>;
}

const matrix = emptyMatrix(3);

matrix[0][0][0] = 42;
```

@category Array
*/
type MultidimensionalArray<Element, Dimensions extends number> = number extends Dimensions
	? Recursive$1<Element>
	: IsEqual<Dimensions, 0> extends true
		? Element
		: Array<MultidimensionalArray<Element, Subtract<Dimensions, 1>>>;

type Recursive<T> = ReadonlyArray<Recursive<T>>;

/**
Creates a type that represents a multidimensional readonly array that of the given type and dimension.

Use-cases:
- Return a n-dimensional array from functions.
- Declare a n-dimensional array by defining its dimensions rather than declaring `[]` repetitively.
- Infer the dimensions of a n-dimensional array automatically from function arguments.
- Avoid the need to know in advance the dimensions of a n-dimensional array allowing them to be dynamic.

@example
```
import type {MultidimensionalReadonlyArray} from 'type-fest';

function emptyMatrix<T extends number>(dimensions: T): MultidimensionalReadonlyArray<unknown, T> {
	const matrix: unknown[] = [];

	let subMatrix = matrix;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		console.log(`Initializing dimension #${dimension}`);

		subMatrix[0] = [];
		if (dimension < dimensions - 1) {
			subMatrix = subMatrix[0] as unknown[];
		} else {
			subMatrix[0] = 42;
		}
	}

	return matrix as MultidimensionalReadonlyArray<unknown, T>;
}

const matrix = emptyMatrix(3);

const answer = matrix[0][0][0]; // 42
```

@category Array
*/
type MultidimensionalReadonlyArray<Element, Dimensions extends number> = number extends Dimensions
	? Recursive<Element>
	: IsEqual<Dimensions, 0> extends true
		? Element
		: ReadonlyArray<MultidimensionalReadonlyArray<Element, Subtract<Dimensions, 1>>>;

/**
Get the element type of an `Iterable`/`AsyncIterable`. For example, an array or a generator.

This can be useful, for example, if you want to get the type that is yielded in a generator function. Often the return type of those functions are not specified.

This type works with both `Iterable`s and `AsyncIterable`s, so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:

@example
```
import type {IterableElement} from 'type-fest';

function * iAmGenerator() {
	yield 1;
	yield 2;
}

type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

And here is an example with an async generator:

@example
```
import type {IterableElement} from 'type-fest';

async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}

type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

Many types in JavaScript/TypeScript are iterables. This type works on all types that implement those interfaces. For example, `Array`, `Set`, `Map`, `stream.Readable`, etc.

An example with an array of strings:

@example
```
import type {IterableElement} from 'type-fest';

type MeString = IterableElement<string[]>
```

@category Iterable
*/
type IterableElement<TargetIterable> =
	TargetIterable extends Iterable<infer ElementType> ?
		ElementType :
		TargetIterable extends AsyncIterable<infer ElementType> ?
			ElementType :
			never;

type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer ValueType> ? ValueType : never;

type ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
type SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entry` type will return the type of that collection's entry.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).

@example
```
import type {Entry} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntry = (example: Entry<Example>) => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed(),
];

const example: Example = {someKey: 1};
const entry = Object.entries(example)[0] as Entry<Example>;
const output = manipulatesEntry(entry);

// Objects
const objectExample = {a: 1};
const objectEntry: Entry<typeof objectExample> = ['a', 1];

// Arrays
const arrayExample = ['a', 1];
const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntry: Entry<typeof mapExample> = ['a', 1];

// Sets
const setExample = new Set(['a', 1]);
const setEntryString: Entry<typeof setExample> = ['a', 'a'];
const setEntryNumber: Entry<typeof setExample> = [1, 1];
```

@category Object
@category Map
@category Array
@category Set
*/
type Entry<BaseType> =
	BaseType extends Map<unknown, unknown> ? MapEntry<BaseType>
		: BaseType extends Set<unknown> ? SetEntry<BaseType>
			: BaseType extends readonly unknown[] ? ArrayEntry<BaseType>
				: BaseType extends object ? ObjectEntry<BaseType>
					: never;

type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;

/**
Many collections have an `entries` method which returns an array of a given object's own enumerable string-keyed property [key, value] pairs. The `Entries` type will return the type of that collection's entries.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`} collections all have this method. Note that `WeakMap` and `WeakSet` do not have this method since their entries are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
import type {Entries} from 'type-fest';

interface Example {
	someKey: number;
}

const manipulatesEntries = (examples: Entries<Example>) => examples.map(example => [
	// Does some arbitrary processing on the key (with type information available)
	example[0].toUpperCase(),

	// Does some arbitrary processing on the value (with type information available)
	example[1].toFixed()
]);

const example: Example = {someKey: 1};
const entries = Object.entries(example) as Entries<Example>;
const output = manipulatesEntries(entries);

// Objects
const objectExample = {a: 1};
const objectEntries: Entries<typeof objectExample> = [['a', 1]];

// Arrays
const arrayExample = ['a', 1];
const arrayEntries: Entries<typeof arrayExample> = [[0, 'a'], [1, 1]];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntries: Entries<typeof map> = [['a', 1]];

// Sets
const setExample = new Set(['a', 1]);
const setEntries: Entries<typeof setExample> = [['a', 'a'], [1, 1]];
```

@category Object
@category Map
@category Set
@category Array
*/
type Entries<BaseType> =
	BaseType extends Map<unknown, unknown> ? MapEntries<BaseType>
		: BaseType extends Set<unknown> ? SetEntries<BaseType>
			: BaseType extends readonly unknown[] ? ArrayEntries<BaseType>
				: BaseType extends object ? ObjectEntries<BaseType>
					: never;

/**
Returns a boolean for whether the given type is `unknown`.

@link https://github.com/dsherret/conditional-type-checks/pull/16

Useful in type utilities, such as when dealing with unknown data from API calls.

@example
```
import type {IsUnknown} from 'type-fest';

// https://github.com/pajecawav/tiny-global-store/blob/master/src/index.ts
type Action<TState, TPayload = void> =
	IsUnknown<TPayload> extends true
		? (state: TState) => TState,
		: (state: TState, payload: TPayload) => TState;

class Store<TState> {
	constructor(private state: TState) {}

	execute<TPayload = void>(action: Action<TState, TPayload>, payload?: TPayload): TState {
		this.state = action(this.state, payload);
		return this.state;
	}

	// ... other methods
}

const store = new Store({value: 1});
declare const someExternalData: unknown;

store.execute(state => ({value: state.value + 1}));
//=> `TPayload` is `void`

store.execute((state, payload) => ({value: state.value + payload}), 5);
//=> `TPayload` is `5`

store.execute((state, payload) => ({value: state.value + payload}), someExternalData);
//=> Errors: `action` is `(state: TState) => TState`
```

@category Utilities
*/
type IsUnknown<T> = (
	unknown extends T // `T` can be `unknown` or `any`
		? IsNull<T> extends false // `any` can be `null`, but `unknown` can't be
			? true
			: false
		: false
);

/**
Create a function type with a return type of your choice and the same parameters as the given function type.

Use-case: You want to define a wrapped function that returns something different while receiving the same parameters. For example, you might want to wrap a function that can throw an error into one that will return `undefined` instead.

@example
```
import type {SetReturnType} from 'type-fest';

type MyFunctionThatCanThrow = (foo: SomeType, bar: unknown) => SomeOtherType;

type MyWrappedFunction = SetReturnType<MyFunctionThatCanThrow, SomeOtherType | undefined>;
//=> type MyWrappedFunction = (foo: SomeType, bar: unknown) => SomeOtherType | undefined;
```

@category Function
*/
type SetReturnType<Fn extends (...arguments_: any[]) => any, TypeToReturn> =
	// Just using `Parameters<Fn>` isn't ideal because it doesn't handle the `this` fake parameter.
	Fn extends (this: infer ThisArg, ...arguments_: infer Arguments) => any ? (
		// If a function did not specify the `this` fake parameter, it will be inferred to `unknown`.
		// We want to detect this situation just to display a friendlier type upon hovering on an IntelliSense-powered IDE.
		IsUnknown<ThisArg> extends true ? (...arguments_: Arguments) => TypeToReturn : (this: ThisArg, ...arguments_: Arguments) => TypeToReturn
	) : (
		// This part should be unreachable, but we make it meaningful just in case…
		(...arguments_: Parameters<Fn>) => TypeToReturn
	);

/**
Create an async version of the given function type, by boxing the return type in `Promise` while keeping the same parameter types.

Use-case: You have two functions, one synchronous and one asynchronous that do the same thing. Instead of having to duplicate the type definition, you can use `Asyncify` to reuse the synchronous type.

@example
```
import type {Asyncify} from 'type-fest';

// Synchronous function.
function getFooSync(someArg: SomeType): Foo {
	// …
}

type AsyncifiedFooGetter = Asyncify<typeof getFooSync>;
//=> type AsyncifiedFooGetter = (someArg: SomeType) => Promise<Foo>;

// Same as `getFooSync` but asynchronous.
const getFooAsync: AsyncifiedFooGetter = (someArg) => {
	// TypeScript now knows that `someArg` is `SomeType` automatically.
	// It also knows that this function must return `Promise<Foo>`.
	// If you have `@typescript-eslint/promise-function-async` linter rule enabled, it will even report that "Functions that return promises must be async.".

	// …
}
```

@category Async
*/
type Asyncify<Fn extends (...arguments_: any[]) => any> = SetReturnType<Fn, Promise<Awaited<ReturnType<Fn>>>>;

type Numeric$1 = number | bigint;

type Zero = 0 | 0n;

/**
Matches the hidden `Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see NegativeInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
type PositiveInfinity = 1e999;

/**
Matches the hidden `-Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see PositiveInfinity

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
type NegativeInfinity = -1e999;

/**
A finite `number`.
You can't pass a `bigint` as they are already guaranteed to be finite.

Use-case: Validating and documenting parameters.

Note: This can't detect `NaN`, please upvote [this issue](https://github.com/microsoft/TypeScript/issues/28682) if you want to have this type as a built-in in TypeScript.

@example
```
import type {Finite} from 'type-fest';

declare function setScore<T extends number>(length: Finite<T>): void;
```

@category Numeric
*/
type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : T;

/**
A `number` that is an integer.
You can't pass a `bigint` as they are already guaranteed to be integers.

Use-case: Validating and documenting parameters.

@example
```
import type {Integer} from 'type-fest';

declare function setYear<T extends number>(length: Integer<T>): void;
```

@see NegativeInteger
@see NonNegativeInteger

@category Numeric
*/
// `${bigint}` is a type that matches a valid bigint literal without the `n` (ex. 1, 0b1, 0o1, 0x1)
// Because T is a number and not a string we can effectively use this to filter out any numbers containing decimal points
type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

/**
A `number` that is not an integer.
You can't pass a `bigint` as they are already guaranteed to be integers.

Use-case: Validating and documenting parameters.

@example
```
import type {Float} from 'type-fest';

declare function setPercentage<T extends number>(length: Float<T>): void;
```

@see Integer

@category Numeric
*/
type Float<T extends number> = T extends Integer<T> ? never : T;

/**
A negative (`-∞ < x < 0`) `number` that is not an integer.
Equivalent to `Negative<Float<T>>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Float

@category Numeric
*/
type NegativeFloat<T extends number> = Negative<Float<T>>;

/**
A negative `number`/`bigint` (`-∞ < x < 0`)

Use-case: Validating and documenting parameters.

@see NegativeInteger
@see NonNegative

@category Numeric
*/
type Negative<T extends Numeric$1> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

/**
A negative (`-∞ < x < 0`) `number` that is an integer.
Equivalent to `Negative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Negative<T>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Integer

@category Numeric
*/
type NegativeInteger<T extends number> = Negative<Integer<T>>;

/**
A non-negative `number`/`bigint` (`0 <= x < ∞`).

Use-case: Validating and documenting parameters.

@see NonNegativeInteger
@see Negative

@example
```
import type {NonNegative} from 'type-fest';

declare function setLength<T extends number>(length: NonNegative<T>): void;
```

@category Numeric
*/
type NonNegative<T extends Numeric$1> = T extends Zero ? T : Negative<T> extends never ? T : never;

/**
A non-negative (`0 <= x < ∞`) `number` that is an integer.
Equivalent to `NonNegative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `NonNegative<T>`.

Use-case: Validating and documenting parameters.

@see NonNegative
@see Integer

@example
```
import type {NonNegativeInteger} from 'type-fest';

declare function setLength<T extends number>(length: NonNegativeInteger<T>): void;
```

@category Numeric
*/
type NonNegativeInteger<T extends number> = NonNegative<Integer<T>>;

// Note: The return value has to be `any` and not `unknown` so it can match `void`.
type NotJsonable = ((...arguments_: any[]) => any) | undefined | symbol;

type JsonifyTuple<T extends [unknown, ...unknown[]]> = {
	[Key in keyof T]: T[Key] extends NotJsonable ? null : Jsonify<T[Key]>;
};

type FilterJsonableKeys<T extends object> = {
	[Key in keyof T]: T[Key] extends NotJsonable ? never : Key;
}[keyof T];

/**
JSON serialize objects (not including arrays) and classes.
*/
type JsonifyObject<T extends object> = {
	[Key in keyof Pick<T, FilterJsonableKeys<T>>]: Jsonify<T[Key]>;
};

/**
Transform a type to one that is assignable to the `JsonValue` type.

This includes:
1. Transforming JSON `interface` to a `type` that is assignable to `JsonValue`.
2. Transforming non-JSON value that is *jsonable* to a type that is assignable to `JsonValue`, where *jsonable* means the non-JSON value implements the `.toJSON()` method that returns a value that is assignable to `JsonValue`.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not be satisfy `JsonValue`.

@example
```
import type {Jsonify, JsonValue} from 'type-fest';

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1]
};

const problemFn = (data: JsonValue) => {
	// Does something with data
};

problemFn(point); // Error: type Geometry is not assignable to parameter of type JsonValue because it is an interface

const fixedFn = <T>(data: Jsonify<T>) => {
	// Does something with data
};

fixedFn(point); // Good: point is assignable. Jsonify<T> transforms Geometry into value assignable to JsonValue
fixedFn(new Date()); // Error: As expected, Date is not assignable. Jsonify<T> cannot transforms Date into value assignable to JsonValue
```

Non-JSON values such as `Date` implement `.toJSON()`, so they can be transformed to a value assignable to `JsonValue`:

@example
```
import type {Jsonify} from 'type-fest';

const time = {
	timeValue: new Date()
};

// `Jsonify<typeof time>` is equivalent to `{timeValue: string}`
const timeJson = JSON.parse(JSON.stringify(time)) as Jsonify<typeof time>;
```

@link https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category JSON
*/
type Jsonify<T> = IsAny<T> extends true
	? any
	: T extends PositiveInfinity | NegativeInfinity
		? null
		: T extends JsonPrimitive
			? T
			: // Instanced primitives are objects
			T extends Number
				? number
				: T extends String
					? string
					: T extends Boolean
						? boolean
						: T extends Map<any, any> | Set<any>
							? EmptyObject
							: T extends TypedArray
								? Record<string, number>
								: T extends NotJsonable
									? never // Non-JSONable type union was found not empty
									: // Any object with toJSON is special case
									T extends {toJSON(): infer J}
										? (() => J) extends () => JsonValue // Is J assignable to JsonValue?
											? J // Then T is Jsonable and its Jsonable value is J
											: Jsonify<J> // Maybe if we look a level deeper we'll find a JsonValue
										: T extends []
											? []
											: T extends [unknown, ...unknown[]]
												? JsonifyTuple<T>
												: T extends ReadonlyArray<infer U>
													? Array<U extends NotJsonable ? null : Jsonify<U>>
													: T extends object
														? JsonifyObject<UndefinedToOptional<T>> // JsonifyObject recursive call for its children
														: never; // Otherwise any other non-object is removed

type JsonifiableObject = {[Key in string]?: Jsonifiable} | {toJSON: () => Jsonifiable};
type JsonifiableArray = readonly Jsonifiable[];

/**
Matches a value that can be losslessly converted to JSON.

Can be used to type values that you expect to pass to `JSON.stringify`.

`undefined` is allowed in object fields (for example, `{a?: number}`) as a special case even though `JSON.stringify({a: undefined})` is `{}` because it makes this class more widely useful and checking for undefined-but-present values is likely an anti-pattern.

@example
```
import type {Jsonifiable} from 'type-fest';

// @ts-expect-error
const error: Jsonifiable = {
    map: new Map([['a', 1]]),
};

JSON.stringify(error);
//=> {"map": {}}

const good: Jsonifiable = {
    number: 3,
    date: new Date(),
    missing: undefined,
}

JSON.stringify(good);
//=> {"number": 3, "date": "2022-10-17T22:22:35.920Z"}
```

@category JSON
*/
type Jsonifiable = JsonPrimitive | JsonifiableObject | JsonifiableArray;

/**
Create a deep version of another object type where property values are recursively replaced into a given value type.

Use-cases:
- Form validation: Define how each field should be validated.
- Form settings: Define configuration for input fields.
- Parsing: Define types that specify special behavior for specific fields.

@example
```
import type {Schema} from 'type-fest';

interface User {
	id: string;
	name: {
		firstname: string;
		lastname: string;
	};
	created: Date;
	active: boolean;
	passwordHash: string;
}

type UserMask = Schema<User, 'mask' | 'hide' | 'show'>;

const userMaskSettings: UserMask = {
	id: 'show',
	name: {
		firstname: 'show',
		lastname: 'mask',
	},
	created: 'show',
	active: 'show',
	passwordHash: 'hide',
}
```

@category Object
*/
type Schema<ObjectType, ValueType> = ObjectType extends string
	? ValueType
	: ObjectType extends Map<unknown, unknown>
		? ValueType
		: ObjectType extends Set<unknown>
			? ValueType
			: ObjectType extends ReadonlyMap<unknown, unknown>
				? ValueType
				: ObjectType extends ReadonlySet<unknown>
					? ValueType
					: ObjectType extends readonly unknown[]
						? ValueType
						: ObjectType extends unknown[]
							? ValueType
							: ObjectType extends (...arguments: unknown[]) => unknown
								? ValueType
								: ObjectType extends Date
									? ValueType
									: ObjectType extends Function
										? ValueType
										: ObjectType extends RegExp
											? ValueType
											: ObjectType extends object
												? SchemaObject<ObjectType, ValueType>
												: ValueType;

/**
Same as `Schema`, but accepts only `object`s as inputs. Internal helper for `Schema`.
*/
type SchemaObject<ObjectType extends object, K> = {
	[KeyType in keyof ObjectType]: Schema<ObjectType[KeyType], K> | K;
};

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
Like `LiteralToPrimitive` except it converts literal types inside an object or array deeply.

For example, given a constant object, it returns a new object type with the same keys but with all the values converted to primitives.

@see LiteralToPrimitive

Use-case: Deal with data that is imported from a JSON file.

@example
```
import type {LiteralToPrimitiveDeep, TsConfigJson} from 'type-fest';
import tsconfig from 'path/to/tsconfig.json';

function doSomethingWithTSConfig(config: LiteralToPrimitiveDeep<TsConfigJson>) { ... }

// No casting is needed to pass the type check
doSomethingWithTSConfig(tsconfig);

// If LiteralToPrimitiveDeep is not used, you need to cast the imported data like this:
doSomethingWithTSConfig(tsconfig as TsConfigJson);
```

@category Type
@category Object
*/
type LiteralToPrimitiveDeep<T> = T extends object
	? T extends Array<infer U>
		? Array<LiteralToPrimitiveDeep<U>>
		: {
			[K in keyof OmitIndexSignature<T>]: LiteralToPrimitiveDeep<T[K]>;
		}
	: LiteralToPrimitive<T>;

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
Create a type from `ParameterType` and `InputType` and change keys exclusive to `InputType` to `never`.
- Generate a list of keys that exists in `InputType` but not in `ParameterType`.
- Mark these excess keys as `never`.
*/
type ExactObject<ParameterType, InputType> = {[Key in keyof ParameterType]: Exact<ParameterType[Key], ObjectValue<InputType, Key>>}
& Record<Exclude<keyof InputType, KeysOfUnion<ParameterType>>, never>;

/**
Create a type that does not allow extra properties, meaning it only allows properties that are explicitly declared.

This is useful for function type-guarding to reject arguments with excess properties. Due to the nature of TypeScript, it does not complain if excess properties are provided unless the provided value is an object literal.

*Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/12936) if you want to have this type as a built-in in TypeScript.*

@example
```
type OnlyAcceptName = {name: string};

function onlyAcceptName(arguments_: OnlyAcceptName) {}

// TypeScript complains about excess properties when an object literal is provided.
onlyAcceptName({name: 'name', id: 1});
//=> `id` is excess

// TypeScript does not complain about excess properties when the provided value is a variable (not an object literal).
const invalidInput = {name: 'name', id: 1};
onlyAcceptName(invalidInput); // No errors
```

Having `Exact` allows TypeScript to reject excess properties.

@example
```
import {Exact} from 'type-fest';

type OnlyAcceptName = {name: string};

function onlyAcceptNameImproved<T extends Exact<OnlyAcceptName, T>>(arguments_: T) {}

const invalidInput = {name: 'name', id: 1};
onlyAcceptNameImproved(invalidInput); // Compilation error
```

[Read more](https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined)

@category Utilities
*/
type Exact<ParameterType, InputType> =
	IsEqual<ParameterType, InputType> extends true ? ParameterType
		// Convert union of array to array of union: A[] & B[] => (A & B)[]
		: ParameterType extends unknown[] ? Array<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
			// In TypeScript, Array is a subtype of ReadonlyArray, so always test Array before ReadonlyArray.
			: ParameterType extends readonly unknown[] ? ReadonlyArray<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
				// For Opaque types, internal details are hidden from public, so let's leave it as is.
				: ParameterType extends Opaque<infer OpaqueType, infer OpaqueToken> ? ParameterType
					: ParameterType extends object ? ExactObject<ParameterType, InputType>
						: ParameterType;

/**
Creates a read-only tuple of type `Element` and with the length of `Length`.

@private
@see `ReadonlyTuple` which is safer because it tests if `Length` is a specific finite number.
*/
type BuildTupleHelper<Element, Length extends number, Rest extends Element[]> =
	Rest['length'] extends Length ?
		readonly [...Rest] : // Terminate with readonly array (aka tuple)
		BuildTupleHelper<Element, Length, [Element, ...Rest]>;

/**
Create a type that represents a read-only tuple of the given type and length.

Use-cases:
- Declaring fixed-length tuples with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating a tuple of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import {ReadonlyTuple} from 'type-fest';

type FencingTeam = ReadonlyTuple<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@category Utilities
*/
type ReadonlyTuple<Element, Length extends number> =
	number extends Length
		// Because `Length extends number` and `number extends Length`, then `Length` is not a specific finite number.
		? readonly Element[] // It's not fixed length.
		: BuildTupleHelper<Element, Length, []>; // Otherwise it is a fixed length tuple.

/**
Extract all optional keys from the given type.

This is useful when you want to create a new type that contains different type values for the optional keys only.

@example
```
import type {OptionalKeysOf, Except} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const REMOVE_FIELD = Symbol('remove field symbol');
type UpdateOperation<Entity extends object> = Except<Partial<Entity>, OptionalKeysOf<Entity>> & {
	[Key in OptionalKeysOf<Entity>]?: Entity[Key] | typeof REMOVE_FIELD;
};

const update1: UpdateOperation<User> = {
	name: 'Alice'
};

const update2: UpdateOperation<User> = {
	name: 'Bob',
	luckyNumber: REMOVE_FIELD
};
```

@category Utilities
*/
type OptionalKeysOf<BaseType extends object> = Exclude<{
	[Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
		? never
		: Key
}[keyof BaseType], undefined>;

/**
Override existing properties of the given type. Similar to `Merge`, but enforces that the original type has the properties you want to override.

This is useful when you want to override existing properties with a different type and make sure that these properties really exist in the original.

@example
```
type Foo = {
	a: string
	b: string
}
type Bar = OverrideProperties<Foo, {b: number}>
//=> {a: string, b: number}

type Baz = OverrideProperties<Foo, {c: number}>
// Error, type '{ c: number; }' does not satisfy the constraint '{ c: never; }'

type Fizz = OverrideProperties<Foo, {b: number; c: number}>
// Error, type '{ b: number; c: number; }' does not satisfy the constraint '{ b: number; c: never; }'
```

@category Object
*/
type OverrideProperties<
	TOriginal,
	TOverride extends {[Key in keyof TOverride]: Key extends keyof TOriginal ? TOverride[Key] : never},
> = Merge<TOriginal, TOverride>;

/**
Creates a type that represents `true` or `false` depending on whether the given type has any optional fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of optional fields.

@example
```
import type {HasOptionalKeys, OptionalKeysOf} from 'type-fest';

type UpdateService<Entity extends object> = {
	removeField: HasOptionalKeys<Entity> extends true
		? (field: OptionalKeysOf<Entity>) => Promise<void>
		: never
}
```

@category Utilities
*/
type HasOptionalKeys<BaseType extends object> = OptionalKeysOf<BaseType> extends never ? false : true;

/**
Extract all required keys from the given type.

This is useful when you want to create a new type that contains different type values for the required keys only or use the list of keys for validation purposes, etc...

@example
```
import type {RequiredKeysOf} from 'type-fest';

declare function createValidation<Entity extends object, Key extends RequiredKeysOf<Entity> = RequiredKeysOf<Entity>>(field: Key, validator: (value: Entity[Key]) => boolean): ValidatorFn;

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

const validator1 = createValidation<User>('name', value => value.length < 25);
const validator2 = createValidation<User>('surname', value => value.length < 25);
```

@category Utilities
*/
type RequiredKeysOf<BaseType extends object> = Exclude<{
	[Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
		? Key
		: never
}[keyof BaseType], undefined>;

/**
Creates a type that represents `true` or `false` depending on whether the given type has any required fields.

This is useful when you want to create an API whose behavior depends on the presence or absence of required fields.

@example
```
import type {HasRequiredKeys} from 'type-fest';

type GeneratorOptions<Template extends object> = {
	prop1: number;
	prop2: string;
} & (HasRequiredKeys<Template> extends true
	? {template: Template}
	: {template?: Template});

interface Template1 {
	optionalSubParam?: string;
}

interface Template2 {
	requiredSubParam: string;
}

type Options1 = GeneratorOptions<Template1>;
type Options2 = GeneratorOptions<Template2>;

const optA: Options1 = {
	prop1: 0,
	prop2: 'hi'
};
const optB: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {}
};
const optC: Options1 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		optionalSubParam: 'optional value'
	}
};

const optD: Options2 = {
	prop1: 0,
	prop2: 'hi',
	template: {
		requiredSubParam: 'required value'
	}
};

```

@category Utilities
*/
type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;

type SpreadObject<FirstType extends object, SecondType extends object> = {
	[Key in keyof FirstType]: Key extends keyof SecondType
		? FirstType[Key] | Required<SecondType>[Key]
		: FirstType[Key];
} & Pick<
SecondType,
RequiredKeysOf<SecondType> | Exclude<keyof SecondType, keyof FirstType>
>;

type TupleOrArray = readonly [...unknown[]];

type SpreadTupleOrArray<
	FirstType extends TupleOrArray,
	SecondType extends TupleOrArray,
> = Array<FirstType[number] | SecondType[number]>;

type Spreadable = object | TupleOrArray;

/**
Mimic the type inferred by TypeScript when merging two objects or two arrays/tuples using the spread syntax.

@example
```
import type {Spread} from 'type-fest';

type Foo = {
	a: number;
	b?: string;
};

type Bar = {
	b?: number;
	c: boolean;
};

const foo = {a: 1, b: '2'};
const bar = {c: false};
const fooBar = {...foo, ...bar};

type FooBar = Spread<Foo, Bar>;
// type FooBar = {
// 	a: number;
// 	b?: string | number | undefined;
// 	c: boolean;
// }

const baz = (argument: FooBar) => {
	// Do something
}

baz(fooBar);
```

@example
```
import type {Spread} from 'type-fest';

const foo = [1, 2, 3];
const bar = ['4', '5', '6'];

const fooBar = [...foo, ...bar];
type FooBar = Spread<typeof foo, typeof bar>;
// FooBar = (string | number)[]

const baz = (argument: FooBar) => {
	// Do something
};

baz(fooBar);
```

@category Object
*/
type Spread<
	FirstType extends Spreadable,
	SecondType extends Spreadable,
> = FirstType extends TupleOrArray
	? SecondType extends TupleOrArray
		? SpreadTupleOrArray<FirstType, SecondType>
		: Simplify<SpreadObject<FirstType, SecondType>>
	: Simplify<SpreadObject<FirstType, SecondType>>;

/**
Convert a tuple/array into a union type of its elements.

This can be useful when you have a fixed set of allowed values and want a type defining only the allowed values, but do not want to repeat yourself.

@example
```
import type {TupleToUnion} from 'type-fest';

const destinations = ['a', 'b', 'c'] as const;

type Destination = TupleToUnion<typeof destinations>;
//=> 'a' | 'b' | 'c'

function verifyDestination(destination: unknown): destination is Destination {
	return destinations.includes(destination as any);
}

type RequestBody = {
	deliverTo: Destination;
};

function verifyRequestBody(body: unknown): body is RequestBody {
	const deliverTo = (body as any).deliverTo;
	return typeof body === 'object' && body !== null && verifyDestination(deliverTo);
}
```

Alternatively, you may use `typeof destinations[number]`. If `destinations` is a tuple, there is no difference. However if `destinations` is a string, the resulting type will the union of the characters in the string. Other types of `destinations` may result in a compile error. In comparison, TupleToUnion will return `never` if a tuple is not provided.

@example
```
const destinations = ['a', 'b', 'c'] as const;

type Destination = typeof destinations[number];
//=> 'a' | 'b' | 'c'

const erroringType = new Set(['a', 'b', 'c']);

type ErroringType = typeof erroringType[number];
//=> Type 'Set<string>' has no matching index signature for type 'number'. ts(2537)

const numberBool: { [n: number]: boolean } = { 1: true };

type NumberBool = typeof numberBool[number];
//=> boolean
```

@category Array
*/
type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[number] : never;

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

/**
An if-else-like type that resolves depending on whether the given type is `any`.

@see {@link IsAny}

@example
```
import type {IfAny} from 'type-fest';

type ShouldBeTrue = IfAny<any>;
//=> true

type ShouldBeBar = IfAny<'not any', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (
	IsAny<T> extends true ? TypeIfAny : TypeIfNotAny
);

/**
An if-else-like type that resolves depending on whether the given type is `never`.

@see {@link IsNever}

@example
```
import type {IfNever} from 'type-fest';

type ShouldBeTrue = IfNever<never>;
//=> true

type ShouldBeBar = IfNever<'not never', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (
	IsNever<T> extends true ? TypeIfNever : TypeIfNotNever
);

/**
An if-else-like type that resolves depending on whether the given type is `unknown`.

@see {@link IsUnknown}

@example
```
import type {IfUnknown} from 'type-fest';

type ShouldBeTrue = IfUnknown<unknown>;
//=> true

type ShouldBeBar = IfUnknown<'not unknown', 'foo', 'bar'>;
//=> 'bar'
```

@category Type Guard
@category Utilities
*/
type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (
	IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown
);

type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word];

type RemoveLastCharacter<Sentence extends string, Character extends string> = Sentence extends `${infer LeftSide}${Character}`
	? SkipEmptyWord<LeftSide>
	: never;

/**
Split a string (almost) like Lodash's `_.words()` function.

- Split on each word that begins with a capital letter.
- Split on each {@link WordSeparators}.
- Split on numeric sequence.

@example
```
type Words0 = SplitWords<'helloWorld'>; // ['hello', 'World']
type Words1 = SplitWords<'helloWORLD'>; // ['hello', 'WORLD']
type Words2 = SplitWords<'hello-world'>; // ['hello', 'world']
type Words3 = SplitWords<'--hello the_world'>; // ['hello', 'the', 'world']
type Words4 = SplitWords<'lifeIs42'>; // ['life', 'Is', '42']
```

@internal
@category Change case
@category Template literal
*/
type SplitWords<
	Sentence extends string,
	LastCharacter extends string = '',
	CurrentWord extends string = '',
> = Sentence extends `${infer FirstCharacter}${infer RemainingCharacters}`
	? FirstCharacter extends WordSeparators
		// Skip word separator
		? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters>]
		: LastCharacter extends ''
			// Fist char of word
			? SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>
			// Case change: non-numeric to numeric, push word
			: [false, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
				? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
				// Case change: numeric to non-numeric, push word
				: [true, false] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
					? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
					// No case change: concat word
					: [true, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
						? SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
					// Case change: lower to upper, push word
						: [true, true] extends [IsLowerCase<LastCharacter>, IsUpperCase<FirstCharacter>]
							? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingCharacters, FirstCharacter, FirstCharacter>]
						// Case change: upper to lower, brings back the last character, push word
							: [true, true] extends [IsUpperCase<LastCharacter>, IsLowerCase<FirstCharacter>]
								? [...RemoveLastCharacter<CurrentWord, LastCharacter>, ...SplitWords<RemainingCharacters, FirstCharacter, `${LastCharacter}${FirstCharacter}`>]
							// No case change: concat word
								: SplitWords<RemainingCharacters, FirstCharacter, `${CurrentWord}${FirstCharacter}`>
	: [...SkipEmptyWord<CurrentWord>];

/**
CamelCase options.

@see {@link CamelCase}
*/
type CamelCaseOptions = {
	/**
	Whether to preserved consecutive uppercase letter.

	@default true
	*/
	preserveConsecutiveUppercase?: boolean;
};

/**
Convert an array of words to camel-case.
*/
type CamelCaseFromArray<
	Words extends string[],
	Options extends CamelCaseOptions,
	OutputString extends string = '',
> = Words extends [
	infer FirstWord extends string,
	...infer RemainingWords extends string[],
]
	? Options['preserveConsecutiveUppercase'] extends true
		? `${Capitalize<FirstWord>}${CamelCaseFromArray<RemainingWords, Options>}`
		: `${Capitalize<Lowercase<FirstWord>>}${CamelCaseFromArray<RemainingWords, Options>}`
	: OutputString;

/**
Convert a string literal to camel-case.

This can be useful when, for example, converting some kebab-cased command-line flags or a snake-cased database result.

By default, consecutive uppercase letter are preserved. See {@link CamelCaseOptions.preserveConsecutiveUppercase preserveConsecutiveUppercase} option to change this behaviour.

@example
```
import type {CamelCase} from 'type-fest';

// Simple

const someVariable: CamelCase<'foo-bar'> = 'fooBar';

// Advanced

type CamelCasedProperties<T> = {
	[K in keyof T as CamelCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
	BAR: string;
	QUZ_QUX: number;
	'OTHER-FIELD': boolean;
}

const dbResult: CamelCasedProperties<RawOptions> = {
	dryRun: true,
	fullFamilyName: 'bar.js',
	foo: 123,
	bar: 'foo',
	quzQux: 6,
	otherField: false
};
```

@category Change case
@category Template literal
*/
type CamelCase<Type, Options extends CamelCaseOptions = {preserveConsecutiveUppercase: true}> = Type extends string
	? string extends Type
		? Type
		: Uncapitalize<CamelCaseFromArray<SplitWords<Type extends Uppercase<Type> ? Lowercase<Type> : Type>, Options>>
	: Type;

/**
Convert object properties to camel case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see CamelCasedPropertiesDeep
@see CamelCase

@example
```
import type {CamelCasedProperties} from 'type-fest';

interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type CamelCasedProperties<Value, Options extends CamelCaseOptions = {preserveConsecutiveUppercase: true}> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {
			[K in keyof Value as CamelCase<K, Options>]: Value[K];
		};

/**
Convert object properties to camel case recursively.

This can be useful when, for example, converting some API types from a different style.

@see CamelCasedProperties
@see CamelCase

@example
```
import type {CamelCasedPropertiesDeep} from 'type-fest';

interface User {
	UserId: number;
	UserName: string;
}

interface UserWithFriends {
	UserInfo: User;
	UserFriends: User[];
}

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
		},
		{
			userId: 3,
			userName: 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type CamelCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {preserveConsecutiveUppercase: true}> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Array<CamelCasedPropertiesDeep<U, Options>>
		: Value extends Set<infer U>
			? Set<CamelCasedPropertiesDeep<U, Options>> : {
				[K in keyof Value as CamelCase<K, Options>]: CamelCasedPropertiesDeep<Value[K], Options>;
			};

// Transforms a string that is fully uppercase into a fully lowercase version. Needed to add support for SCREAMING_SNAKE_CASE, see https://github.com/sindresorhus/type-fest/issues/385
type UpperCaseToLowerCase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T;

// This implementation does not support SCREAMING_SNAKE_CASE, it is used internally by `SplitIncludingDelimiters`.
type SplitIncludingDelimiters_<Source extends string, Delimiter extends string> =
	Source extends '' ? [] :
		Source extends `${infer FirstPart}${Delimiter}${infer SecondPart}` ?
			(
				Source extends `${FirstPart}${infer UsedDelimiter}${SecondPart}`
					? UsedDelimiter extends Delimiter
						? Source extends `${infer FirstPart}${UsedDelimiter}${infer SecondPart}`
							? [...SplitIncludingDelimiters<FirstPart, Delimiter>, UsedDelimiter, ...SplitIncludingDelimiters<SecondPart, Delimiter>]
							: never
						: never
					: never
			) :
			[Source];

/**
Unlike a simpler split, this one includes the delimiter splitted on in the resulting array literal. This is to enable splitting on, for example, upper-case characters.

@category Template literal
*/
type SplitIncludingDelimiters<Source extends string, Delimiter extends string> = SplitIncludingDelimiters_<UpperCaseToLowerCase<Source>, Delimiter>;

/**
Format a specific part of the splitted string literal that `StringArrayToDelimiterCase<>` fuses together, ensuring desired casing.

@see StringArrayToDelimiterCase
*/
type StringPartToDelimiterCase<StringPart extends string, Start extends boolean, UsedWordSeparators extends string, UsedUpperCaseCharacters extends string, Delimiter extends string> =
	StringPart extends UsedWordSeparators ? Delimiter :
		Start extends true ? Lowercase<StringPart> :
			StringPart extends UsedUpperCaseCharacters ? `${Delimiter}${Lowercase<StringPart>}` :
				StringPart;

/**
Takes the result of a splitted string literal and recursively concatenates it together into the desired casing.

It receives `UsedWordSeparators` and `UsedUpperCaseCharacters` as input to ensure it's fully encapsulated.

@see SplitIncludingDelimiters
*/
type StringArrayToDelimiterCase<Parts extends readonly any[], Start extends boolean, UsedWordSeparators extends string, UsedUpperCaseCharacters extends string, Delimiter extends string> =
	Parts extends [`${infer FirstPart}`, ...infer RemainingParts]
		? `${StringPartToDelimiterCase<FirstPart, Start, UsedWordSeparators, UsedUpperCaseCharacters, Delimiter>}${StringArrayToDelimiterCase<RemainingParts, false, UsedWordSeparators, UsedUpperCaseCharacters, Delimiter>}`
		: Parts extends [string]
			? string
			: '';

/**
Convert a string literal to a custom string delimiter casing.

This can be useful when, for example, converting a camel-cased object property to an oddly cased one.

@see KebabCase
@see SnakeCase

@example
```
import type {DelimiterCase} from 'type-fest';

// Simple

const someVariable: DelimiterCase<'fooBar', '#'> = 'foo#bar';

// Advanced

type OddlyCasedProperties<T> = {
	[K in keyof T as DelimiterCase<K, '#'>]: T[K]
};

interface SomeOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: OddlyCasedProperties<SomeOptions> = {
	'dry#run': true,
	'include#file': 'bar.js',
	foo: 123
};
```

@category Change case
@category Template literal
*/
type DelimiterCase<Value, Delimiter extends string> = string extends Value ? Value : Value extends string
	? StringArrayToDelimiterCase<
	SplitIncludingDelimiters<Value, WordSeparators | UpperCaseCharacters>,
	true,
	WordSeparators,
	UpperCaseCharacters,
	Delimiter
	>
	: Value;

/**
Convert a string literal to kebab-case.

This can be useful when, for example, converting a camel-cased object property to a kebab-cased CSS class name or a command-line flag.

@example
```
import type {KebabCase} from 'type-fest';

// Simple

const someVariable: KebabCase<'fooBar'> = 'foo-bar';

// Advanced

type KebabCasedProperties<T> = {
	[K in keyof T as KebabCase<K>]: T[K]
};

interface CliOptions {
	dryRun: boolean;
	includeFile: string;
	foo: number;
}

const rawCliOptions: KebabCasedProperties<CliOptions> = {
	'dry-run': true,
	'include-file': 'bar.js',
	foo: 123
};
```

@category Change case
@category Template literal
*/
type KebabCase<Value> = DelimiterCase<Value, '-'>;

/**
Convert object properties to delimiter case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see DelimiterCase
@see DelimiterCasedPropertiesDeep

@example
```
import type {DelimiterCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type DelimiterCasedProperties<
	Value,
	Delimiter extends string,
> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {[K in keyof Value as DelimiterCase<K, Delimiter>]: Value[K]};

/**
Convert object properties to kebab case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see KebabCase
@see KebabCasedPropertiesDeep

@example
```
import type {KebabCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type KebabCasedProperties<Value> = DelimiterCasedProperties<Value, '-'>;

/**
Convert object properties to delimiter case recursively.

This can be useful when, for example, converting some API types from a different style.

@see DelimiterCase
@see DelimiterCasedProperties

@example
```
import type {DelimiterCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: DelimiterCasedPropertiesDeep<UserWithFriends, '-'> = {
	'user-info': {
	'user-id': 1,
		'user-name': 'Tom',
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type DelimiterCasedPropertiesDeep<
	Value,
	Delimiter extends string,
> = Value extends Function | Date | RegExp
	? Value
	: Value extends Array<infer U>
		? Array<DelimiterCasedPropertiesDeep<U, Delimiter>>
		: Value extends Set<infer U>
			? Set<DelimiterCasedPropertiesDeep<U, Delimiter>> : {
				[K in keyof Value as DelimiterCase<
				K,
				Delimiter
				>]: DelimiterCasedPropertiesDeep<Value[K], Delimiter>;
			};

/**
Convert object properties to kebab case recursively.

This can be useful when, for example, converting some API types from a different style.

@see KebabCase
@see KebabCasedProperties

@example
```
import type [KebabCasedPropertiesDeep] from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: KebabCasedPropertiesDeep<UserWithFriends> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom',
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type KebabCasedPropertiesDeep<Value> = DelimiterCasedPropertiesDeep<Value, '-'>;

/**
Converts a string literal to pascal-case.

@example
```
import type {PascalCase} from 'type-fest';

// Simple

const someVariable: PascalCase<'foo-bar'> = 'FooBar';

// Advanced

type PascalCaseProps<T> = {
	[K in keyof T as PascalCase<K>]: T[K]
};

interface RawOptions {
	'dry-run': boolean;
	'full_family_name': string;
	foo: number;
}

const dbResult: CamelCasedProperties<ModelProps> = {
	DryRun: true,
	FullFamilyName: 'bar.js',
	Foo: 123
};
```

@category Change case
@category Template literal
*/
type PascalCase<Value> = CamelCase<Value> extends string
	? Capitalize<CamelCase<Value>>
	: CamelCase<Value>;

/**
Convert object properties to pascal case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see PascalCase
@see PascalCasedPropertiesDeep

@example
```
import type {PascalCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type PascalCasedProperties<Value> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {[K in keyof Value as PascalCase<K>]: Value[K]};

/**
Convert object properties to pascal case recursively.

This can be useful when, for example, converting some API types from a different style.

@see PascalCase
@see PascalCasedProperties

@example
```
import type {PascalCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
		},
		{
			UserId: 3,
			UserName: 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type PascalCasedPropertiesDeep<Value> = Value extends Function | Date | RegExp
	? Value
	: Value extends Array<infer U>
		? Array<PascalCasedPropertiesDeep<U>>
		: Value extends Set<infer U>
			? Set<PascalCasedPropertiesDeep<U>> : {
				[K in keyof Value as PascalCase<K>]: PascalCasedPropertiesDeep<Value[K]>;
			};

/**
Convert a string literal to snake-case.

This can be useful when, for example, converting a camel-cased object property to a snake-cased SQL column name.

@example
```
import type {SnakeCase} from 'type-fest';

// Simple

const someVariable: SnakeCase<'fooBar'> = 'foo_bar';

// Advanced

type SnakeCasedProperties<T> = {
	[K in keyof T as SnakeCase<K>]: T[K]
};

interface ModelProps {
	isHappy: boolean;
	fullFamilyName: string;
	foo: number;
}

const dbResult: SnakeCasedProperties<ModelProps> = {
	'is_happy': true,
	'full_family_name': 'Carla Smith',
	foo: 123
};
```

@category Change case
@category Template literal
*/
type SnakeCase<Value> = DelimiterCase<Value, '_'>;

/**
Convert object properties to snake case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see SnakeCase
@see SnakeCasedPropertiesDeep

@example
```
import type {SnakeCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
type SnakeCasedProperties<Value> = DelimiterCasedProperties<Value, '_'>;

/**
Convert object properties to snake case recursively.

This can be useful when, for example, converting some API types from a different style.

@see SnakeCase
@see SnakeCasedProperties

@example
```
import type {SnakeCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: SnakeCasedPropertiesDeep<UserWithFriends> = {
	user_info: {
		user_id: 1,
		user_name: 'Tom',
	},
	user_friends: [
		{
			user_id: 2,
			user_name: 'Jerry',
		},
		{
			user_id: 3,
			user_name: 'Spike',
		},
	],
};
```

@category Change case
@category Template literal
@category Object
*/
type SnakeCasedPropertiesDeep<Value> = DelimiterCasedPropertiesDeep<Value, '_'>;

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import type {Includes} from 'type-fest';

type hasRed<array extends any[]> = Includes<array, 'red'>;
```

@category Array
*/
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;

/**
Returns a boolean for whether the string is screaming snake case.
*/
type IsScreamingSnakeCase<Value extends string> = Value extends Uppercase<Value>
	? Includes<SplitIncludingDelimiters<Lowercase<Value>, '_'>, '_'> extends true
		? true
		: false
	: false;

/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import type {ScreamingSnakeCase} from 'type-fest';

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
```

@category Change case
@category Template literal
*/
type ScreamingSnakeCase<Value> = Value extends string
	? IsScreamingSnakeCase<Value> extends true
		? Value
		: Uppercase<SnakeCase<Value>>
	: Value;

// The builtin `join` method supports all these natively in the same way that typescript handles them so we can safely accept all of them.
type JoinableItem = string | number | bigint | boolean | undefined | null;

// `null` and `undefined` are treated uniquely in the built-in join method, in a way that differs from the default `toString` that would result in the type `${undefined}`. That's why we need to handle it specifically with this helper.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description
type NullishCoalesce<
	Value extends JoinableItem,
	Fallback extends string,
> = Value extends undefined | null ? NonNullable<Value> | Fallback : Value;

/**
Join an array of strings and/or numbers using the given string as a delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
import type {Join} from 'type-fest';

// Mixed (strings & numbers) items; result is: 'foo.0.baz'
const path: Join<['foo', 0, 'baz'], '.'> = ['foo', 0, 'baz'].join('.');

// Only string items; result is: 'foo.bar.baz'
const path: Join<['foo', 'bar', 'baz'], '.'> = ['foo', 'bar', 'baz'].join('.');

// Only number items; result is: '1.2.3'
const path: Join<[1, 2, 3], '.'> = [1, 2, 3].join('.');

// Only bigint items; result is '1.2.3'
const path: Join<[1n, 2n, 3n], '.'> = [1n, 2n, 3n].join('.');

// Only boolean items; result is: 'true.false.true'
const path: Join<[true, false, true], '.'> = [true, false, true].join('.');

// Contains nullish items; result is: 'foo..baz..xyz'
const path: Join<['foo', undefined, 'baz', null, 'xyz'], '.'> = ['foo', undefined, 'baz', null, 'xyz'].join('.');

// Partial tuple shapes (rest param last); result is: `prefix.${string}`
const path: Join<['prefix', ...string[]], '.'> = ['prefix'].join('.');

// Partial tuple shapes (rest param first); result is: `${string}.suffix`
const path: Join<[...string[], 'suffix'], '.'> = ['suffix'].join('.');

// Tuples items with nullish unions; result is '.' | 'hello.' | '.world' | 'hello.world'
const path: Join<['hello' | undefined, 'world' | null], '.'> = ['hello', 'world'].join('.');
```

@category Array
@category Template literal
*/
type Join<
	Items extends readonly JoinableItem[],
	Delimiter extends string,
> = Items extends []
	? ''
	: Items extends readonly [JoinableItem?]
		? `${NullishCoalesce<Items[0], ''>}`
		: Items extends readonly [
			infer First extends JoinableItem,
			...infer Tail extends readonly JoinableItem[],
		]
			? `${NullishCoalesce<First, ''>}${Delimiter}${Join<Tail, Delimiter>}`
			: Items extends readonly [
				...infer Head extends readonly JoinableItem[],
				infer Last extends JoinableItem,
			]
				? `${Join<Head, Delimiter>}${Delimiter}${NullishCoalesce<Last, ''>}`
				: string;

/**
Represents an array of strings split using a given character or character set.

Use-case: Defining the return type of a method like `String.prototype.split`.

@example
```
import type {Split} from 'type-fest';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
let array: Item[];

array = split(items, ',');
```

@category String
@category Template literal
*/
type Split<
	S extends string,
	Delimiter extends string,
> = S extends `${infer Head}${Delimiter}${infer Tail}`
	? [Head, ...Split<Tail, Delimiter>]
	: S extends Delimiter
		? []
		: [S];

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

type GetOptions = {
	/**
	Include `undefined` in the return type when accessing properties.

	Setting this to `false` is not recommended.

	@default true
	*/
	strict?: boolean;
};

/**
Like the `Get` type but receives an array of strings as a path parameter.
*/
type GetWithPath<BaseType, Keys extends readonly string[], Options extends GetOptions = {}> =
	Keys extends []
		? BaseType
		: Keys extends readonly [infer Head, ...infer Tail]
			? GetWithPath<
			PropertyOf<BaseType, Extract<Head, string>, Options>,
			Extract<Tail, string[]>,
			Options
			>
			: never;

/**
Adds `undefined` to `Type` if `strict` is enabled.
*/
type Strictify<Type, Options extends GetOptions> =
	Options['strict'] extends false ? Type : (Type | undefined);

/**
If `Options['strict']` is `true`, includes `undefined` in the returned type when accessing properties on `Record<string, any>`.

Known limitations:
- Does not include `undefined` in the type on object types with an index signature (for example, `{a: string; [key: string]: string}`).
*/
type StrictPropertyOf<BaseType, Key extends keyof BaseType, Options extends GetOptions> =
	Record<string, any> extends BaseType
		? string extends keyof BaseType
			? Strictify<BaseType[Key], Options> // Record<string, any>
			: BaseType[Key] // Record<'a' | 'b', any> (Records with a string union as keys have required properties)
		: BaseType[Key];

/**
Splits a dot-prop style path into a tuple comprised of the properties in the path. Handles square-bracket notation.

@example
```
ToPath<'foo.bar.baz'>
//=> ['foo', 'bar', 'baz']

ToPath<'foo[0].bar.baz'>
//=> ['foo', '0', 'bar', 'baz']
```
*/
type ToPath<S extends string> = Split<FixPathSquareBrackets<S>, '.'>;

/**
Replaces square-bracketed dot notation with dots, for example, `foo[0].bar` -> `foo.0.bar`.
*/
type FixPathSquareBrackets<Path extends string> =
	Path extends `[${infer Head}]${infer Tail}`
		? Tail extends `[${string}`
			? `${Head}.${FixPathSquareBrackets<Tail>}`
			: `${Head}${FixPathSquareBrackets<Tail>}`
		: Path extends `${infer Head}[${infer Middle}]${infer Tail}`
			? `${Head}.${FixPathSquareBrackets<`[${Middle}]${Tail}`>}`
			: Path;

/**
Returns true if `LongString` is made up out of `Substring` repeated 0 or more times.

@example
```
ConsistsOnlyOf<'aaa', 'a'> //=> true
ConsistsOnlyOf<'ababab', 'ab'> //=> true
ConsistsOnlyOf<'aBa', 'a'> //=> false
ConsistsOnlyOf<'', 'a'> //=> true
```
*/
type ConsistsOnlyOf<LongString extends string, Substring extends string> =
	LongString extends ''
		? true
		: LongString extends `${Substring}${infer Tail}`
			? ConsistsOnlyOf<Tail, Substring>
			: false;

/**
Convert a type which may have number keys to one with string keys, making it possible to index using strings retrieved from template types.

@example
```
type WithNumbers = {foo: string; 0: boolean};
type WithStrings = WithStringKeys<WithNumbers>;

type WithNumbersKeys = keyof WithNumbers;
//=> 'foo' | 0
type WithStringsKeys = keyof WithStrings;
//=> 'foo' | '0'
```
*/
type WithStringKeys<BaseType> = {
	[Key in StringKeyOf<BaseType>]: UncheckedIndex<BaseType, Key>
};

/**
Perform a `T[U]` operation if `T` supports indexing.
*/
type UncheckedIndex<T, U extends string | number> = [T] extends [Record<string | number, any>] ? T[U] : never;

/**
Get a property of an object or array. Works when indexing arrays using number-literal-strings, for example, `PropertyOf<number[], '0'> = number`, and when indexing objects with number keys.

Note:
- Returns `unknown` if `Key` is not a property of `BaseType`, since TypeScript uses structural typing, and it cannot be guaranteed that extra properties unknown to the type system will exist at runtime.
- Returns `undefined` from nullish values, to match the behaviour of most deep-key libraries like `lodash`, `dot-prop`, etc.
*/
type PropertyOf<BaseType, Key extends string, Options extends GetOptions = {}> =
	BaseType extends null | undefined
		? undefined
		: Key extends keyof BaseType
			? StrictPropertyOf<BaseType, Key, Options>
			: BaseType extends [] | [unknown, ...unknown[]]
				? unknown // It's a tuple, but `Key` did not extend `keyof BaseType`. So the index is out of bounds.
				: BaseType extends {
					[n: number]: infer Item;
					length: number; // Note: This is needed to avoid being too lax with records types using number keys like `{0: string; 1: boolean}`.
				}
					? (
						ConsistsOnlyOf<Key, StringDigit> extends true
							? Strictify<Item, Options>
							: unknown
					)
					: Key extends keyof WithStringKeys<BaseType>
						? StrictPropertyOf<WithStringKeys<BaseType>, Key, Options>
						: unknown;

// This works by first splitting the path based on `.` and `[...]` characters into a tuple of string keys. Then it recursively uses the head key to get the next property of the current object, until there are no keys left. Number keys extract the item type from arrays, or are converted to strings to extract types from tuples and dictionaries with number keys.
/**
Get a deeply-nested property from an object using a key path, like Lodash's `.get()` function.

Use-case: Retrieve a property from deep inside an API response or some other complex object.

@example
```
import type {Get} from 'type-fest';
import * as lodash from 'lodash';

const get = <BaseType, Path extends string | readonly string[]>(object: BaseType, path: Path): Get<BaseType, Path> =>
	lodash.get(object, path);

interface ApiResponse {
	hits: {
		hits: Array<{
			_id: string
			_source: {
				name: Array<{
					given: string[]
					family: string
				}>
				birthDate: string
			}
		}>
	}
}

const getName = (apiResponse: ApiResponse) =>
	get(apiResponse, 'hits.hits[0]._source.name');
	//=> Array<{given: string[]; family: string}> | undefined

// Path also supports a readonly array of strings
const getNameWithPathArray = (apiResponse: ApiResponse) =>
	get(apiResponse, ['hits','hits', '0', '_source', 'name'] as const);
	//=> Array<{given: string[]; family: string}> | undefined

// Non-strict mode:
Get<string[], '3', {strict: false}> //=> string
Get<Record<string, string>, 'foo', {strict: true}> // => string
```

@category Object
@category Array
@category Template literal
*/
type Get<BaseType, Path extends string | readonly string[], Options extends GetOptions = {}> =
	GetWithPath<BaseType, Path extends string ? ToPath<Path> : Path, Options>;

/**
Extracts the type of the last element of an array.

Use-case: Defining the return type of functions that extract the last element of an array, for example [`lodash.last`](https://lodash.com/docs/4.17.15#last).

@example
```
import type {LastArrayElement} from 'type-fest';

declare function lastOf<V extends readonly any[]>(array: V): LastArrayElement<V>;

const array = ['foo', 2];

typeof lastOf(array);
//=> number
```

@category Array
@category Template literal
*/
type LastArrayElement<ValueType extends readonly unknown[]> =
	ValueType extends readonly [infer ElementType]
		? ElementType
		: ValueType extends readonly [infer _, ...infer Tail]
			? LastArrayElement<Tail>
			: ValueType extends ReadonlyArray<infer ElementType>
				? ElementType
				: never;

/**
Declare locally scoped properties on `globalThis`.

When defining a global variable in a declaration file is inappropriate, it can be helpful to define a `type` or `interface` (say `ExtraGlobals`) with the global variable and then cast `globalThis` via code like `globalThis as unknown as ExtraGlobals`.

Instead of casting through `unknown`, you can update your `type` or `interface` to extend `GlobalThis` and then directly cast `globalThis`.

@example
```
import type {GlobalThis} from 'type-fest';

type ExtraGlobals = GlobalThis & {
	readonly GLOBAL_TOKEN: string;
};

(globalThis as ExtraGlobals).GLOBAL_TOKEN;
```

@category Type
*/
type GlobalThis = typeof globalThis;

declare namespace PackageJson {
	/**
	A person who has been involved in creating or maintaining the package.
	*/
	export type Person =
		| string
		| {
			name: string;
			url?: string;
			email?: string;
		};

	export type BugsLocation =
		| string
		| {
			/**
			The URL to the package's issue tracker.
			*/
			url?: string;

			/**
			The email address to which issues should be reported.
			*/
			email?: string;
		};

	export type DirectoryLocations = {
		[directoryType: string]: JsonValue | undefined;

		/**
		Location for executable scripts. Sugar to generate entries in the `bin` property by walking the folder.
		*/
		bin?: string;

		/**
		Location for Markdown files.
		*/
		doc?: string;

		/**
		Location for example scripts.
		*/
		example?: string;

		/**
		Location for the bulk of the library.
		*/
		lib?: string;

		/**
		Location for man pages. Sugar to generate a `man` array by walking the folder.
		*/
		man?: string;

		/**
		Location for test files.
		*/
		test?: string;
	};

	export type Scripts = {
		/**
		Run **before** the package is published (Also run on local `npm install` without any arguments).
		*/
		prepublish?: string;

		/**
		Run both **before** the package is packed and published, and on local `npm install` without any arguments. This is run **after** `prepublish`, but **before** `prepublishOnly`.
		*/
		prepare?: string;

		/**
		Run **before** the package is prepared and packed, **only** on `npm publish`.
		*/
		prepublishOnly?: string;

		/**
		Run **before** a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).
		*/
		prepack?: string;

		/**
		Run **after** the tarball has been generated and moved to its final destination.
		*/
		postpack?: string;

		/**
		Run **after** the package is published.
		*/
		publish?: string;

		/**
		Run **after** the package is published.
		*/
		postpublish?: string;

		/**
		Run **before** the package is installed.
		*/
		preinstall?: string;

		/**
		Run **after** the package is installed.
		*/
		install?: string;

		/**
		Run **after** the package is installed and after `install`.
		*/
		postinstall?: string;

		/**
		Run **before** the package is uninstalled and before `uninstall`.
		*/
		preuninstall?: string;

		/**
		Run **before** the package is uninstalled.
		*/
		uninstall?: string;

		/**
		Run **after** the package is uninstalled.
		*/
		postuninstall?: string;

		/**
		Run **before** bump the package version and before `version`.
		*/
		preversion?: string;

		/**
		Run **before** bump the package version.
		*/
		version?: string;

		/**
		Run **after** bump the package version.
		*/
		postversion?: string;

		/**
		Run with the `npm test` command, before `test`.
		*/
		pretest?: string;

		/**
		Run with the `npm test` command.
		*/
		test?: string;

		/**
		Run with the `npm test` command, after `test`.
		*/
		posttest?: string;

		/**
		Run with the `npm stop` command, before `stop`.
		*/
		prestop?: string;

		/**
		Run with the `npm stop` command.
		*/
		stop?: string;

		/**
		Run with the `npm stop` command, after `stop`.
		*/
		poststop?: string;

		/**
		Run with the `npm start` command, before `start`.
		*/
		prestart?: string;

		/**
		Run with the `npm start` command.
		*/
		start?: string;

		/**
		Run with the `npm start` command, after `start`.
		*/
		poststart?: string;

		/**
		Run with the `npm restart` command, before `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		prerestart?: string;

		/**
		Run with the `npm restart` command. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		restart?: string;

		/**
		Run with the `npm restart` command, after `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
		*/
		postrestart?: string;
	} & Partial<Record<string, string>>;

	/**
	Dependencies of the package. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or Git URL.
	*/
	export type Dependency = Partial<Record<string, string>>;

	/**
	Conditions which provide a way to resolve a package entry point based on the environment.
	*/
	export type ExportCondition = LiteralUnion<
	| 'import'
	| 'require'
	| 'node'
	| 'node-addons'
	| 'deno'
	| 'browser'
	| 'electron'
	| 'react-native'
	| 'default',
	string
	>;

	/**
	A mapping of conditions and the paths to which they resolve.
	*/
	type ExportConditions = {[condition in ExportCondition]?: Exports};

	/**
	Entry points of a module, optionally with conditions and subpath exports.
	*/
	export type Exports =
	| null
	| string
	| Array<string | ExportConditions>
	| ExportConditions;

	/**
	Import map entries of a module, optionally with conditions and subpath imports.
	*/
	export type Imports = { // eslint-disable-line @typescript-eslint/consistent-indexed-object-style
		[key: `#${string}`]: Exports;
	};

	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface NonStandardEntryPoints {
		/**
		An ECMAScript module ID that is the primary entry point to the program.
		*/
		module?: string;

		/**
		A module ID with untranspiled code that is the primary entry point to the program.
		*/
		esnext?:
		| string
		| {
			[moduleName: string]: string | undefined;
			main?: string;
			browser?: string;
		};

		/**
		A hint to JavaScript bundlers or component tools when packaging modules for client side use.
		*/
		browser?:
		| string
		| Partial<Record<string, string | false>>;

		/**
		Denote which files in your project are "pure" and therefore safe for Webpack to prune if unused.

		[Read more.](https://webpack.js.org/guides/tree-shaking/)
		*/
		sideEffects?: boolean | string[];
	}

	export type TypeScriptConfiguration = {
		/**
		Location of the bundled TypeScript declaration file.
		*/
		types?: string;

		/**
		Version selection map of TypeScript.
		*/
		typesVersions?: Partial<Record<string, Partial<Record<string, string[]>>>>;

		/**
		Location of the bundled TypeScript declaration file. Alias of `types`.
		*/
		typings?: string;
	};

	/**
	An alternative configuration for workspaces.
	*/
	export type WorkspaceConfig = {
		/**
		An array of workspace pattern strings which contain the workspace packages.
		*/
		packages?: WorkspacePattern[];

		/**
		Designed to solve the problem of packages which break when their `node_modules` are moved to the root workspace directory - a process known as hoisting. For these packages, both within your workspace, and also some that have been installed via `node_modules`, it is important to have a mechanism for preventing the default Yarn workspace behavior. By adding workspace pattern strings here, Yarn will resume non-workspace behavior for any package which matches the defined patterns.

		[Supported](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) by Yarn.
		[Not supported](https://github.com/npm/rfcs/issues/287) by npm.
		*/
		nohoist?: WorkspacePattern[];
	};

	/**
	A workspace pattern points to a directory or group of directories which contain packages that should be included in the workspace installation process.

	The patterns are handled with [minimatch](https://github.com/isaacs/minimatch).

	@example
	`docs` → Include the docs directory and install its dependencies.
	`packages/*` → Include all nested directories within the packages directory, like `packages/cli` and `packages/core`.
	*/
	type WorkspacePattern = string;

	export type YarnConfiguration = {
		/**
		If your package only allows one version of a given dependency, and you’d like to enforce the same behavior as `yarn install --flat` on the command-line, set this to `true`.

		Note that if your `package.json` contains `"flat": true` and other packages depend on yours (e.g. you are building a library rather than an app), those other packages will also need `"flat": true` in their `package.json` or be installed with `yarn install --flat` on the command-line.
		*/
		flat?: boolean;

		/**
		Selective version resolutions. Allows the definition of custom package versions inside dependencies without manual edits in the `yarn.lock` file.
		*/
		resolutions?: Dependency;
	};

	export type JSPMConfiguration = {
		/**
		JSPM configuration.
		*/
		jspm?: PackageJson;
	};

	/**
	Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Containing standard npm properties.
	*/
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface PackageJsonStandard {
		/**
		The name of the package.
		*/
		name?: string;

		/**
		Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
		*/
		version?: string;

		/**
		Package description, listed in `npm search`.
		*/
		description?: string;

		/**
		Keywords associated with package, listed in `npm search`.
		*/
		keywords?: string[];

		/**
		The URL to the package's homepage.
		*/
		homepage?: LiteralUnion<'.', string>;

		/**
		The URL to the package's issue tracker and/or the email address to which issues should be reported.
		*/
		bugs?: BugsLocation;

		/**
		The license for the package.
		*/
		license?: string;

		/**
		The licenses for the package.
		*/
		licenses?: Array<{
			type?: string;
			url?: string;
		}>;

		author?: Person;

		/**
		A list of people who contributed to the package.
		*/
		contributors?: Person[];

		/**
		A list of people who maintain the package.
		*/
		maintainers?: Person[];

		/**
		The files included in the package.
		*/
		files?: string[];

		/**
		Resolution algorithm for importing ".js" files from the package's scope.

		[Read more.](https://nodejs.org/api/esm.html#esm_package_json_type_field)
		*/
		type?: 'module' | 'commonjs';

		/**
		The module ID that is the primary entry point to the program.
		*/
		main?: string;

		/**
		Subpath exports to define entry points of the package.

		[Read more.](https://nodejs.org/api/packages.html#subpath-exports)
		*/
		exports?: Exports;

		/**
		Subpath imports to define internal package import maps that only apply to import specifiers from within the package itself.

		[Read more.](https://nodejs.org/api/packages.html#subpath-imports)
		*/
		imports?: Imports;

		/**
		The executable files that should be installed into the `PATH`.
		*/
		bin?:
		| string
		| Partial<Record<string, string>>;

		/**
		Filenames to put in place for the `man` program to find.
		*/
		man?: string | string[];

		/**
		Indicates the structure of the package.
		*/
		directories?: DirectoryLocations;

		/**
		Location for the code repository.
		*/
		repository?:
		| string
		| {
			type: string;
			url: string;

			/**
			Relative path to package.json if it is placed in non-root directory (for example if it is part of a monorepo).

			[Read more.](https://github.com/npm/rfcs/blob/latest/implemented/0010-monorepo-subdirectory-declaration.md)
			*/
			directory?: string;
		};

		/**
		Script commands that are run at various times in the lifecycle of the package. The key is the lifecycle event, and the value is the command to run at that point.
		*/
		scripts?: Scripts;

		/**
		Is used to set configuration parameters used in package scripts that persist across upgrades.
		*/
		config?: JsonObject;

		/**
		The dependencies of the package.
		*/
		dependencies?: Dependency;

		/**
		Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.
		*/
		devDependencies?: Dependency;

		/**
		Dependencies that are skipped if they fail to install.
		*/
		optionalDependencies?: Dependency;

		/**
		Dependencies that will usually be required by the package user directly or via another dependency.
		*/
		peerDependencies?: Dependency;

		/**
		Indicate peer dependencies that are optional.
		*/
		peerDependenciesMeta?: Partial<Record<string, {optional: true}>>;

		/**
		Package names that are bundled when the package is published.
		*/
		bundledDependencies?: string[];

		/**
		Alias of `bundledDependencies`.
		*/
		bundleDependencies?: string[];

		/**
		Engines that this package runs on.
		*/
		engines?: {
			[EngineName in 'npm' | 'node' | string]?: string; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
		};

		/**
		@deprecated
		*/
		engineStrict?: boolean;

		/**
		Operating systems the module runs on.
		*/
		os?: Array<LiteralUnion<
		| 'aix'
		| 'darwin'
		| 'freebsd'
		| 'linux'
		| 'openbsd'
		| 'sunos'
		| 'win32'
		| '!aix'
		| '!darwin'
		| '!freebsd'
		| '!linux'
		| '!openbsd'
		| '!sunos'
		| '!win32',
		string
		>>;

		/**
		CPU architectures the module runs on.
		*/
		cpu?: Array<LiteralUnion<
		| 'arm'
		| 'arm64'
		| 'ia32'
		| 'mips'
		| 'mipsel'
		| 'ppc'
		| 'ppc64'
		| 's390'
		| 's390x'
		| 'x32'
		| 'x64'
		| '!arm'
		| '!arm64'
		| '!ia32'
		| '!mips'
		| '!mipsel'
		| '!ppc'
		| '!ppc64'
		| '!s390'
		| '!s390x'
		| '!x32'
		| '!x64',
		string
		>>;

		/**
		If set to `true`, a warning will be shown if package is installed locally. Useful if the package is primarily a command-line application that should be installed globally.

		@deprecated
		*/
		preferGlobal?: boolean;

		/**
		If set to `true`, then npm will refuse to publish it.
		*/
		private?: boolean;

		/**
		A set of config values that will be used at publish-time. It's especially handy to set the tag, registry or access, to ensure that a given package is not tagged with 'latest', published to the global public registry or that a scoped module is private by default.
		*/
		publishConfig?: PublishConfig;

		/**
		Describes and notifies consumers of a package's monetary support information.

		[Read more.](https://github.com/npm/rfcs/blob/latest/accepted/0017-add-funding-support.md)
		*/
		funding?: string | {
			/**
			The type of funding.
			*/
			type?: LiteralUnion<
			| 'github'
			| 'opencollective'
			| 'patreon'
			| 'individual'
			| 'foundation'
			| 'corporation',
			string
			>;

			/**
			The URL to the funding page.
			*/
			url: string;
		};

		/**
		Used to configure [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) / [Yarn workspaces](https://classic.yarnpkg.com/docs/workspaces/).

		Workspaces allow you to manage multiple packages within the same repository in such a way that you only need to run your install command once in order to install all of them in a single pass.

		Please note that the top-level `private` property of `package.json` **must** be set to `true` in order to use workspaces.
		*/
		workspaces?: WorkspacePattern[] | WorkspaceConfig;
	}

	/**
	Type for [`package.json` file used by the Node.js runtime](https://nodejs.org/api/packages.html#nodejs-packagejson-field-definitions).
	*/
	export type NodeJsStandard = {
		/**
		Defines which package manager is expected to be used when working on the current project. It can set to any of the [supported package managers](https://nodejs.org/api/corepack.html#supported-package-managers), and will ensure that your teams use the exact same package manager versions without having to install anything else than Node.js.

		__This field is currently experimental and needs to be opted-in; check the [Corepack](https://nodejs.org/api/corepack.html) page for details about the procedure.__

		@example
		```json
		{
			"packageManager": "<package manager name>@<version>"
		}
		```
		*/
		packageManager?: string;
	};

	export type PublishConfig = {
		/**
		Additional, less common properties from the [npm docs on `publishConfig`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#publishconfig).
		*/
		[additionalProperties: string]: JsonValue | undefined;

		/**
		When publishing scoped packages, the access level defaults to restricted. If you want your scoped package to be publicly viewable (and installable) set `--access=public`. The only valid values for access are public and restricted. Unscoped packages always have an access level of public.
		*/
		access?: 'public' | 'restricted';

		/**
		The base URL of the npm registry.

		Default: `'https://registry.npmjs.org/'`
		*/
		registry?: string;

		/**
		The tag to publish the package under.

		Default: `'latest'`
		*/
		tag?: string;
	};
}

/**
Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file). Also includes types for fields used by other popular projects, like TypeScript and Yarn.

@category File
*/
type PackageJson =
JsonObject &
PackageJson.NodeJsStandard &
PackageJson.PackageJsonStandard &
PackageJson.NonStandardEntryPoints &
PackageJson.TypeScriptConfiguration &
PackageJson.YarnConfiguration &
PackageJson.JSPMConfiguration;

declare namespace TsConfigJson {
	namespace CompilerOptions {
		export type JSX =
			| 'preserve'
			| 'react'
			| 'react-jsx'
			| 'react-jsxdev'
			| 'react-native';

		export type Module =
			| 'CommonJS'
			| 'AMD'
			| 'System'
			| 'UMD'
			| 'ES6'
			| 'ES2015'
			| 'ES2020'
			| 'ES2022'
			| 'ESNext'
			| 'Node16'
			| 'NodeNext'
			| 'None'
			// Lowercase alternatives
			| 'commonjs'
			| 'amd'
			| 'system'
			| 'umd'
			| 'es6'
			| 'es2015'
			| 'es2020'
			| 'es2022'
			| 'esnext'
			| 'node16'
			| 'nodenext'
			| 'none';

		export type NewLine =
			| 'CRLF'
			| 'LF'
			// Lowercase alternatives
			| 'crlf'
			| 'lf';

		export type Target =
			| 'ES3'
			| 'ES5'
			| 'ES6'
			| 'ES2015'
			| 'ES2016'
			| 'ES2017'
			| 'ES2018'
			| 'ES2019'
			| 'ES2020'
			| 'ES2021'
			| 'ES2022'
			| 'ESNext'
			// Lowercase alternatives
			| 'es3'
			| 'es5'
			| 'es6'
			| 'es2015'
			| 'es2016'
			| 'es2017'
			| 'es2018'
			| 'es2019'
			| 'es2020'
			| 'es2021'
			| 'es2022'
			| 'esnext';

		export type Lib =
			| 'ES5'
			| 'ES6'
			| 'ES7'
			| 'ES2015'
			| 'ES2015.Collection'
			| 'ES2015.Core'
			| 'ES2015.Generator'
			| 'ES2015.Iterable'
			| 'ES2015.Promise'
			| 'ES2015.Proxy'
			| 'ES2015.Reflect'
			| 'ES2015.Symbol.WellKnown'
			| 'ES2015.Symbol'
			| 'ES2016'
			| 'ES2016.Array.Include'
			| 'ES2017'
			| 'ES2017.Intl'
			| 'ES2017.Object'
			| 'ES2017.SharedMemory'
			| 'ES2017.String'
			| 'ES2017.TypedArrays'
			| 'ES2018'
			| 'ES2018.AsyncGenerator'
			| 'ES2018.AsyncIterable'
			| 'ES2018.Intl'
			| 'ES2018.Promise'
			| 'ES2018.Regexp'
			| 'ES2019'
			| 'ES2019.Array'
			| 'ES2019.Object'
			| 'ES2019.String'
			| 'ES2019.Symbol'
			| 'ES2020'
			| 'ES2020.BigInt'
			| 'ES2020.Promise'
			| 'ES2020.String'
			| 'ES2020.Symbol.WellKnown'
			| 'ES2020.SharedMemory'
			| 'ES2020.Intl'
			| 'ES2021'
			| 'ES2021.Promise'
			| 'ES2021.String'
			| 'ES2021.WeakRef'
			| 'ESNext'
			| 'ESNext.Array'
			| 'ESNext.AsyncIterable'
			| 'ESNext.BigInt'
			| 'ESNext.Intl'
			| 'ESNext.Promise'
			| 'ESNext.String'
			| 'ESNext.Symbol'
			| 'ESNext.WeakRef'
			| 'DOM'
			| 'DOM.Iterable'
			| 'ScriptHost'
			| 'WebWorker'
			| 'WebWorker.ImportScripts'
			| 'WebWorker.Iterable'
			// Lowercase alternatives
			| 'es5'
			| 'es6'
			| 'es7'
			| 'es2015'
			| 'es2015.collection'
			| 'es2015.core'
			| 'es2015.generator'
			| 'es2015.iterable'
			| 'es2015.promise'
			| 'es2015.proxy'
			| 'es2015.reflect'
			| 'es2015.symbol.wellknown'
			| 'es2015.symbol'
			| 'es2016'
			| 'es2016.array.include'
			| 'es2017'
			| 'es2017.intl'
			| 'es2017.object'
			| 'es2017.sharedmemory'
			| 'es2017.string'
			| 'es2017.typedarrays'
			| 'es2018'
			| 'es2018.asyncgenerator'
			| 'es2018.asynciterable'
			| 'es2018.intl'
			| 'es2018.promise'
			| 'es2018.regexp'
			| 'es2019'
			| 'es2019.array'
			| 'es2019.object'
			| 'es2019.string'
			| 'es2019.symbol'
			| 'es2020'
			| 'es2020.bigint'
			| 'es2020.promise'
			| 'es2020.string'
			| 'es2020.symbol.wellknown'
			| 'es2020.sharedmemory'
			| 'es2020.intl'
			| 'es2021'
			| 'es2021.promise'
			| 'es2021.string'
			| 'es2021.weakref'
			| 'esnext'
			| 'esnext.array'
			| 'esnext.asynciterable'
			| 'esnext.bigint'
			| 'esnext.intl'
			| 'esnext.promise'
			| 'esnext.string'
			| 'esnext.symbol'
			| 'esnext.weakref'
			| 'dom'
			| 'dom.iterable'
			| 'scripthost'
			| 'webworker'
			| 'webworker.importscripts'
			| 'webworker.iterable';

		export type Plugin = {
			/**
			Plugin name.
			*/
			name: string;
		};

		export type ImportsNotUsedAsValues =
			| 'remove'
			| 'preserve'
			| 'error';

		export type FallbackPolling =
			| 'fixedPollingInterval'
			| 'priorityPollingInterval'
			| 'dynamicPriorityPolling'
			| 'fixedInterval'
			| 'priorityInterval'
			| 'dynamicPriority'
			| 'fixedChunkSize';

		export type WatchDirectory =
			| 'useFsEvents'
			| 'fixedPollingInterval'
			| 'dynamicPriorityPolling'
			| 'fixedChunkSizePolling';

		export type WatchFile =
			| 'fixedPollingInterval'
			| 'priorityPollingInterval'
			| 'dynamicPriorityPolling'
			| 'useFsEvents'
			| 'useFsEventsOnParentDirectory'
			| 'fixedChunkSizePolling';

		export type ModuleResolution =
			| 'classic'
			| 'node'
			| 'node10'
			| 'node16'
			| 'nodenext'
			| 'bundler'
			// Pascal-cased alternatives
			| 'Classic'
			| 'Node'
			| 'Node10'
			| 'Node16'
			| 'NodeNext'
			| 'Bundler';

		export type ModuleDetection =
			| 'auto'
			| 'legacy'
			| 'force';

		export type IgnoreDeprecations = '5.0';
	}

	export type CompilerOptions = {
		/**
		The character set of the input files.

		@default 'utf8'
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		charset?: string;

		/**
		Enables building for project references.

		@default true
		*/
		composite?: boolean;

		/**
		Generates corresponding d.ts files.

		@default false
		*/
		declaration?: boolean;

		/**
		Specify output directory for generated declaration files.
		*/
		declarationDir?: string;

		/**
		Show diagnostic information.

		@default false
		*/
		diagnostics?: boolean;

		/**
		Reduce the number of projects loaded automatically by TypeScript.

		@default false
		*/
		disableReferencedProjectLoad?: boolean;

		/**
		Enforces using indexed accessors for keys declared using an indexed type.

		@default false
		*/
		noPropertyAccessFromIndexSignature?: boolean;

		/**
		Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.

		@default false
		*/
		emitBOM?: boolean;

		/**
		Only emit `.d.ts` declaration files.

		@default false
		*/
		emitDeclarationOnly?: boolean;

		/**
		Differentiate between undefined and not present when type checking.

		@default false
		*/
		exactOptionalPropertyTypes?: boolean;

		/**
		Enable incremental compilation.

		@default `composite`
		*/
		incremental?: boolean;

		/**
		Specify file to store incremental compilation information.

		@default '.tsbuildinfo'
		*/
		tsBuildInfoFile?: string;

		/**
		Emit a single file with source maps instead of having a separate file.

		@default false
		*/
		inlineSourceMap?: boolean;

		/**
		Emit the source alongside the sourcemaps within a single file.

		Requires `--inlineSourceMap` to be set.

		@default false
		*/
		inlineSources?: boolean;

		/**
		Specify what JSX code is generated.

		@default 'preserve'
		*/
		jsx?: CompilerOptions.JSX;

		/**
		Specifies the object invoked for `createElement` and `__spread` when targeting `'react'` JSX emit.

		@default 'React'
		*/
		reactNamespace?: string;

		/**
		Specify the JSX factory function to use when targeting React JSX emit, e.g. `React.createElement` or `h`.

		@default 'React.createElement'
		*/
		jsxFactory?: string;

		/**
		Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'.

		@default 'React.Fragment'
		*/
		jsxFragmentFactory?: string;

		/**
		Specify module specifier used to import the JSX factory functions when using `jsx: react-jsx*`.

		@default 'react'
		*/
		jsxImportSource?: string;

		/**
		Print names of files part of the compilation.

		@default false
		*/
		listFiles?: boolean;

		/**
		Specifies the location where debugger should locate map files instead of generated locations.
		*/
		mapRoot?: string;

		/**
		Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with `--outFile`. 'ES6' and 'ES2015' values may be used when targeting 'ES5' or lower.

		@default ['ES3', 'ES5'].includes(target) ? 'CommonJS' : 'ES6'
		*/
		module?: CompilerOptions.Module;

		/**
		Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6).

		@default ['AMD', 'System', 'ES6'].includes(module) ? 'classic' : 'node'
		*/
		moduleResolution?: CompilerOptions.ModuleResolution;

		/**
		Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix).

		@default 'LF'
		*/
		newLine?: CompilerOptions.NewLine;

		/**
		Do not emit output.

		@default false
		*/
		noEmit?: boolean;

		/**
		Do not generate custom helper functions like `__extends` in compiled output.

		@default false
		*/
		noEmitHelpers?: boolean;

		/**
		Do not emit outputs if any type checking errors were reported.

		@default false
		*/
		noEmitOnError?: boolean;

		/**
		Warn on expressions and declarations with an implied 'any' type.

		@default false
		*/
		noImplicitAny?: boolean;

		/**
		Raise error on 'this' expressions with an implied any type.

		@default false
		*/
		noImplicitThis?: boolean;

		/**
		Report errors on unused locals.

		@default false
		*/
		noUnusedLocals?: boolean;

		/**
		Report errors on unused parameters.

		@default false
		*/
		noUnusedParameters?: boolean;

		/**
		Do not include the default library file (lib.d.ts).

		@default false
		*/
		noLib?: boolean;

		/**
		Do not add triple-slash references or module import targets to the list of compiled files.

		@default false
		*/
		noResolve?: boolean;

		/**
		Disable strict checking of generic signatures in function types.

		@default false
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		noStrictGenericChecks?: boolean;

		/**
		@deprecated use `skipLibCheck` instead.
		*/
		skipDefaultLibCheck?: boolean;

		/**
		Skip type checking of declaration files.

		@default false
		*/
		skipLibCheck?: boolean;

		/**
		Concatenate and emit output to single file.
		*/
		outFile?: string;

		/**
		Redirect output structure to the directory.
		*/
		outDir?: string;

		/**
		Do not erase const enum declarations in generated code.

		@default false
		*/
		preserveConstEnums?: boolean;

		/**
		Do not resolve symlinks to their real path; treat a symlinked file like a real one.

		@default false
		*/
		preserveSymlinks?: boolean;

		/**
		Keep outdated console output in watch mode instead of clearing the screen.

		@default false
		*/
		preserveWatchOutput?: boolean;

		/**
		Stylize errors and messages using color and context (experimental).

		@default true // Unless piping to another program or redirecting output to a file.
		*/
		pretty?: boolean;

		/**
		Do not emit comments to output.

		@default false
		*/
		removeComments?: boolean;

		/**
		Specifies the root directory of input files.

		Use to control the output directory structure with `--outDir`.
		*/
		rootDir?: string;

		/**
		Unconditionally emit imports for unresolved files.

		@default false
		*/
		isolatedModules?: boolean;

		/**
		Generates corresponding '.map' file.

		@default false
		*/
		sourceMap?: boolean;

		/**
		Specifies the location where debugger should locate TypeScript files instead of source locations.
		*/
		sourceRoot?: string;

		/**
		Suppress excess property checks for object literals.

		@default false
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		suppressExcessPropertyErrors?: boolean;

		/**
		Suppress noImplicitAny errors for indexing objects lacking index signatures.

		@default false
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		suppressImplicitAnyIndexErrors?: boolean;

		/**
		Do not emit declarations for code that has an `@internal` annotation.
		*/
		stripInternal?: boolean;

		/**
		Specify ECMAScript target version.

		@default 'es3'
		*/
		target?: CompilerOptions.Target;

		/**
		Default catch clause variables as `unknown` instead of `any`.

		@default false
		*/
		useUnknownInCatchVariables?: boolean;

		/**
		Watch input files.

		@default false
		@deprecated Use watchOptions instead.
		*/
		watch?: boolean;

		/**
		Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.

		@deprecated Use watchOptions.fallbackPolling instead.
		*/
		fallbackPolling?: CompilerOptions.FallbackPolling;

		/**
		Specify the strategy for watching directories under systems that lack recursive file-watching functionality.

		@default 'useFsEvents'
		@deprecated Use watchOptions.watchDirectory instead.
		*/
		watchDirectory?: CompilerOptions.WatchDirectory;

		/**
		Specify the strategy for watching individual files.

		@default 'useFsEvents'
		@deprecated Use watchOptions.watchFile instead.
		*/
		watchFile?: CompilerOptions.WatchFile;

		/**
		Enables experimental support for ES7 decorators.

		@default false
		*/
		experimentalDecorators?: boolean;

		/**
		Emit design-type metadata for decorated declarations in source.

		@default false
		*/
		emitDecoratorMetadata?: boolean;

		/**
		Do not report errors on unused labels.

		@default false
		*/
		allowUnusedLabels?: boolean;

		/**
		Report error when not all code paths in function return a value.

		@default false
		*/
		noImplicitReturns?: boolean;

		/**
		Add `undefined` to a type when accessed using an index.

		@default false
		*/
		noUncheckedIndexedAccess?: boolean;

		/**
		Report errors for fallthrough cases in switch statement.

		@default false
		*/
		noFallthroughCasesInSwitch?: boolean;

		/**
		Ensure overriding members in derived classes are marked with an override modifier.

		@default false
		*/
		noImplicitOverride?: boolean;

		/**
		Do not report errors on unreachable code.

		@default false
		*/
		allowUnreachableCode?: boolean;

		/**
		Disallow inconsistently-cased references to the same file.

		@default true
		*/
		forceConsistentCasingInFileNames?: boolean;

		/**
		Emit a v8 CPU profile of the compiler run for debugging.

		@default 'profile.cpuprofile'
		*/
		generateCpuProfile?: string;

		/**
		Base directory to resolve non-relative module names.
		*/
		baseUrl?: string;

		/**
		Specify path mapping to be computed relative to baseUrl option.
		*/
		paths?: Record<string, string[]>;

		/**
		List of TypeScript language server plugins to load.
		*/
		plugins?: CompilerOptions.Plugin[];

		/**
		Specify list of root directories to be used when resolving modules.
		*/
		rootDirs?: string[];

		/**
		Specify list of directories for type definition files to be included.
		*/
		typeRoots?: string[];

		/**
		Type declaration files to be included in compilation.
		*/
		types?: string[];

		/**
		Enable tracing of the name resolution process.

		@default false
		*/
		traceResolution?: boolean;

		/**
		Allow javascript files to be compiled.

		@default false
		*/
		allowJs?: boolean;

		/**
		Do not truncate error messages.

		@default false
		*/
		noErrorTruncation?: boolean;

		/**
		Allow default imports from modules with no default export. This does not affect code emit, just typechecking.

		@default module === 'system' || esModuleInterop
		*/
		allowSyntheticDefaultImports?: boolean;

		/**
		Do not emit `'use strict'` directives in module output.

		@default false
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		noImplicitUseStrict?: boolean;

		/**
		Enable to list all emitted files.

		@default false
		*/
		listEmittedFiles?: boolean;

		/**
		Disable size limit for JavaScript project.

		@default false
		*/
		disableSizeLimit?: boolean;

		/**
		List of library files to be included in the compilation.
		*/
		lib?: CompilerOptions.Lib[];

		/**
		Enable strict null checks.

		@default false
		*/
		strictNullChecks?: boolean;

		/**
		The maximum dependency depth to search under `node_modules` and load JavaScript files. Only applicable with `--allowJs`.

		@default 0
		*/
		maxNodeModuleJsDepth?: number;

		/**
		Import emit helpers (e.g. `__extends`, `__rest`, etc..) from tslib.

		@default false
		*/
		importHelpers?: boolean;

		/**
		Specify emit/checking behavior for imports that are only used for types.

		@default 'remove'
		@deprecated Use `verbatimModuleSyntax` instead.
		*/
		importsNotUsedAsValues?: CompilerOptions.ImportsNotUsedAsValues;

		/**
		Parse in strict mode and emit `'use strict'` for each source file.

		@default false
		*/
		alwaysStrict?: boolean;

		/**
		Enable all strict type checking options.

		@default false
		*/
		strict?: boolean;

		/**
		Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions.

		@default false
		*/
		strictBindCallApply?: boolean;

		/**
		Provide full support for iterables in `for-of`, spread, and destructuring when targeting `ES5` or `ES3`.

		@default false
		*/
		downlevelIteration?: boolean;

		/**
		Report errors in `.js` files.

		@default false
		*/
		checkJs?: boolean;

		/**
		Disable bivariant parameter checking for function types.

		@default false
		*/
		strictFunctionTypes?: boolean;

		/**
		Ensure non-undefined class properties are initialized in the constructor.

		@default false
		*/
		strictPropertyInitialization?: boolean;

		/**
		Emit `__importStar` and `__importDefault` helpers for runtime Babel ecosystem compatibility and enable `--allowSyntheticDefaultImports` for typesystem compatibility.

		@default false
		*/
		esModuleInterop?: boolean;

		/**
		Allow accessing UMD globals from modules.

		@default false
		*/
		allowUmdGlobalAccess?: boolean;

		/**
		Resolve `keyof` to string valued property names only (no numbers or symbols).

		@default false
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		keyofStringsOnly?: boolean;

		/**
		Emit ECMAScript standard class fields.

		@default false
		*/
		useDefineForClassFields?: boolean;

		/**
		Generates a sourcemap for each corresponding `.d.ts` file.

		@default false
		*/
		declarationMap?: boolean;

		/**
		Include modules imported with `.json` extension.

		@default false
		*/
		resolveJsonModule?: boolean;

		/**
		Have recompiles in '--incremental' and '--watch' assume that changes within a file will only affect files directly depending on it.

		@default false
		*/
		assumeChangesOnlyAffectDirectDependencies?: boolean;

		/**
		Output more detailed compiler performance information after building.

		@default false
		*/
		extendedDiagnostics?: boolean;

		/**
		Print names of files that are part of the compilation and then stop processing.

		@default false
		*/
		listFilesOnly?: boolean;

		/**
		Disable preferring source files instead of declaration files when referencing composite projects.

		@default true if composite, false otherwise
		*/
		disableSourceOfProjectReferenceRedirect?: boolean;

		/**
		Opt a project out of multi-project reference checking when editing.

		@default false
		*/
		disableSolutionSearching?: boolean;

		/**
		Print names of files which TypeScript sees as a part of your project and the reason they are part of the compilation.

		@default false
		*/
		explainFiles?: boolean;

		/**
		Preserve unused imported values in the JavaScript output that would otherwise be removed.

		@default true
		@deprecated Use `verbatimModuleSyntax` instead.
		*/
		preserveValueImports?: boolean;

		/**
		List of file name suffixes to search when resolving a module.
		*/
		moduleSuffixes?: string[];

		/**
		Control what method is used to detect module-format JS files.

		@default 'auto'
		*/
		moduleDetection?: CompilerOptions.ModuleDetection;

		/**
		Allows TypeScript files to import each other with a TypeScript-specific extension like .ts, .mts, or .tsx.

		@default false
		*/
		allowImportingTsExtensions?: boolean;

		/**
		Forces TypeScript to consult the exports field of package.json files if it ever reads from a package in node_modules.

		@default false
		*/
		resolvePackageJsonExports?: boolean;

		/**
		Forces TypeScript to consult the imports field of package.json files when performing a lookup that starts with # from a file whose ancestor directory contains a package.json.

		@default false
		*/
		resolvePackageJsonImports?: boolean;

		/**
		Suppress errors for file formats that TypeScript does not understand.

		@default false
		*/
		allowArbitraryExtensions?: boolean;

		/**
		List of additional conditions that should succeed when TypeScript resolves from package.json.
		*/
		customConditions?: string[];

		/**
		Anything that uses the type modifier is dropped entirely.

		@default false
		*/
		verbatimModuleSyntax?: boolean;

		/**
		Suppress deprecation warnings
		*/
		ignoreDeprecations?: CompilerOptions.IgnoreDeprecations;
	};

	namespace WatchOptions {
		export type WatchFileKind =
			| 'FixedPollingInterval'
			| 'PriorityPollingInterval'
			| 'DynamicPriorityPolling'
			| 'FixedChunkSizePolling'
			| 'UseFsEvents'
			| 'UseFsEventsOnParentDirectory';

		export type WatchDirectoryKind =
			| 'UseFsEvents'
			| 'FixedPollingInterval'
			| 'DynamicPriorityPolling'
			| 'FixedChunkSizePolling';

		export type PollingWatchKind =
			| 'FixedInterval'
			| 'PriorityInterval'
			| 'DynamicPriority'
			| 'FixedChunkSize';
	}

	export type WatchOptions = {

		/**
		Specify the strategy for watching individual files.

		@default 'UseFsEvents'
		*/
		watchFile?: WatchOptions.WatchFileKind | Lowercase<WatchOptions.WatchFileKind>;

		/**
		Specify the strategy for watching directories under systems that lack recursive file-watching functionality.

		@default 'UseFsEvents'
		*/
		watchDirectory?: WatchOptions.WatchDirectoryKind | Lowercase<WatchOptions.WatchDirectoryKind>;

		/**
		Specify the polling strategy to use when the system runs out of or doesn't support native file watchers.
		*/
		fallbackPolling?: WatchOptions.PollingWatchKind | Lowercase<WatchOptions.PollingWatchKind>;

		/**
		Enable synchronous updates on directory watchers for platforms that don't support recursive watching natively.
		*/
		synchronousWatchDirectory?: boolean;

		/**
		Specifies a list of directories to exclude from watch
		*/
		excludeDirectories?: string[];

		/**
		Specifies a list of files to exclude from watch
		*/
		excludeFiles?: string[];
	};

	/**
	Auto type (.d.ts) acquisition options for this project.
	*/
	export type TypeAcquisition = {
		/**
		Enable auto type acquisition.
		*/
		enable?: boolean;

		/**
		Specifies a list of type declarations to be included in auto type acquisition. For example, `['jquery', 'lodash']`.
		*/
		include?: string[];

		/**
		Specifies a list of type declarations to be excluded from auto type acquisition. For example, `['jquery', 'lodash']`.
		*/
		exclude?: string[];
	};

	export type References = {
		/**
		A normalized path on disk.
		*/
		path: string;

		/**
		The path as the user originally wrote it.
		*/
		originalPath?: string;

		/**
		True if the output of this reference should be prepended to the output of this project.

		Only valid for `--outFile` compilations.
		@deprecated This option will be removed in TypeScript 5.5.
		*/
		prepend?: boolean;

		/**
		True if it is intended that this reference form a circularity.
		*/
		circular?: boolean;
	};
}

/**
Type for [TypeScript's `tsconfig.json` file](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) (TypeScript 3.7).

@category File
*/
type TsConfigJson = {
	/**
	Instructs the TypeScript compiler how to compile `.ts` files.
	*/
	compilerOptions?: TsConfigJson.CompilerOptions;

	/**
	Instructs the TypeScript compiler how to watch files.
	*/
	watchOptions?: TsConfigJson.WatchOptions;

	/**
	Auto type (.d.ts) acquisition options for this project.
	*/
	typeAcquisition?: TsConfigJson.TypeAcquisition;

	/**
	Enable Compile-on-Save for this project.
	*/
	compileOnSave?: boolean;

	/**
	Path to base configuration file to inherit from.
	*/
	extends?: string | string[];

	/**
	If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`. When a `files` property is specified, only those files and those specified by `include` are included.
	*/
	files?: string[];

	/**
	Specifies a list of files to be excluded from compilation. The `exclude` property only affects the files included via the `include` property and not the `files` property.

	Glob patterns require TypeScript version 2.0 or later.
	*/
	exclude?: string[];

	/**
	Specifies a list of glob patterns that match files to be included in compilation.

	If no `files` or `include` property is present in a `tsconfig.json`, the compiler defaults to including all files in the containing directory and subdirectories except those specified by `exclude`.
	*/
	include?: string[];

	/**
	Referenced projects.
	*/
	references?: TsConfigJson.References[];
};

/** Any value that is **not** `null` or `undefined`. */
interface NonNullish {
}
type Nullish = null | undefined;
type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type Multi<T> = T | T[];
type Numeric = number | bigint;
type NumberLike = number | `${number}`;
/**
 * **all** primitives *(i.e. any non-object)*
 * - *lowercased to semantically denote the inverse of the
 * lowercased `object` type and differentiate from {@link Primitive}.*
 */
type primitive = Simplify<Primitive | bigint | symbol>;
/**
 * **common** primitves \
 * *(may be serializable or literally typed)*
 * @see {@link primitive} for *any* primitive
 */
type Primitive = Simplify<string | boolean | number | Nullish>;
/** **any** js value *(primitves or objects)*. */
type JsValue = Simplify<primitive | object>;
/** **plain** js objects. */
type JsObject<value = JsValue> = {
    [key: string]: value;
};
/**
 * More reliably extract a union of a given type's keys as strings by
 * forcefully converting `T` to a {@link Composite} type, and falling
 * back to `string` by default, so that types like `any`, `unknown`,
 * and `never` are not resolved.
 */
type KeyOf<T, Fallback = string, composite = Composite<T>> = StringKeyOf<composite> extends never ? Fallback : StringKeyOf<composite>;
/**
 * Like {@link KeyOf}, but for extracting a
 * union type from the **values** instead.
 */
type ValueOf<T, Fallback = NonNullish, composite = Composite<T>> = KeyOf<T> extends keyof composite ? composite[KeyOf<T>] : Fallback;
/**
 * Like {@link KeyOf}, but recursively extracts nested keys.
 */
type KeyOfDeep<T, current = Composite<T>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = Type<KeyOf<current> | (nested extends never ? never : KeyOfDeep<current[nested]>)>;
/**
 * Like {@link ValueOf}, but recursively extracts nested values. \
 * Note: Values that are being recursed into themselves
 * *(i.e. the parent values containing the sub-values)* are not included.
 */
type ValueOfDeep<T, current = Composite<T>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = Type<current[KeysExcept<current, JsObject<any>>] | (nested extends never ? never : ValueOfDeep<current[nested]>)>;
/**
 * Retrieves all of the keys where the
 * value does **not** extend the given type.
 * - Inverse of type-fest's
 *   {@link https://github.com/sindresorhus/type-fest/blob/main/source/conditional-keys.d.ts | ConditionalKeys}.
 */
type KeysExcept<T, ExcludedTypes> = keyof ConditionalExcept<T, ExcludedTypes>;
/**
 * **Improved catch-all solution for type-fest's
 * {@link https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts | LiteralUnion}** \
 * Generic that allows for both the literal/mapped type
 * and base type without sacrificing completions.
 * - base type automatically inferred from literal.
 * - when a non-literal or non-mapped type is passed,
 *   it will just be {@link Narrow}'ed down or returned as is.
 */
type Union<T> = Type<T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & NonNullish : Narrow<T>)>;
/**
 * Ensure a type can be resolved as an explicit defined type
 * by composing unions of objects into intersections, omitting
 * any permissive unions or index signatures, and leaving behind
 * only explicitly defined properties.
 * - *can be used to reverse effect of {@link Union}, and used internally for {@link KeyOf} and {@link ValueOf}*
 */
type Composite<T, Composed = UnionToIntersection<T>> = Type<T extends Function ? Extract<T, (...args: any) => any> : T extends string | number ? ExtractLiteral<T> : OmitIndexSignature<Composed>>;
/**
 * Narrow down a type to a common base type.
 * - *used internally for {@link Union}*
 */
type Narrow<T> = Type<T extends JsObject<infer Values> ? JsObject<Narrow<Values>> : T extends readonly (infer Item)[] ? Narrow<Item | unknown>[] : T extends ReadonlySet<infer Item> ? Set<Narrow<Item>> : T extends ReadonlyMap<infer K, infer V> ? Map<Narrow<K>, Narrow<V>> : T extends Promise<infer Resolved> ? Promise<Narrow<Resolved>> : T extends Function ? Function : T extends object ? object : T extends primitive ? LiteralToPrimitive<T> : NonNullish>;
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
 * Used internally for {@link Composite}. Reverses effect of {@link Union} for `strings` and `numbers`.
 */
type ExtractLiteral<T extends string | number> = keyof {
    [k in T as IsLiteral<k> extends false ? never : k]: never;
};
/**
 * @internal
 * Wrapped `IsLiteral` from `type-fest` to allow checking type in the parameter. Used internally for {@link Union}.
 */
type IsLiteral<T> = T extends primitive ? IsLiteral$1<T> : false;

export { AbstractClass, AbstractConstructor, AsyncReturnType, Asyncify, CamelCase, CamelCasedProperties, CamelCasedPropertiesDeep, Class, Composite, ConditionalExcept, ConditionalKeys, ConditionalPick, ConditionalPickDeep, ConditionalPickDeepOptions, Constructor, DelimiterCase, DelimiterCasedProperties, DelimiterCasedPropertiesDeep, EmptyObject, Entries, Entry, Exact, Except, Extends, ExtractLiteral, Finite, FixedLengthArray, Float, Get, GlobalThis, HasOptionalKeys, HasRequiredKeys, IfAny, IfNever, IfUnknown, Includes, Integer, InvariantOf, IsAny, IsBooleanLiteral, IsEmptyObject, IsEqual, IsLiteral, IsNever, IsNumericLiteral, IsStringLiteral, IsSymbolLiteral, IsUnknown, IterableElement, Join, JsObject, JsValue, JsonArray, JsonObject, JsonPrimitive, JsonValue, Jsonifiable, Jsonify, KebabCase, KebabCasedProperties, KebabCasedPropertiesDeep, KeyOf, KeyOfDeep, KeysExcept, LastArrayElement, LiteralToPrimitive, LiteralToPrimitiveDeep, LiteralUnion, Maybe, Merge, MergeDeep, MergeDeepOptions, MergeExclusive, Multi, MultidimensionalArray, MultidimensionalReadonlyArray, Narrow, Negative, NegativeFloat, NegativeInfinity, NegativeInteger, NonNegative, NonNegativeInteger, NonNullish, Nullable, Nullish, NumberLike, Numeric, OmitIndexSignature, Opaque, OptionalKeysOf, OverrideProperties, PackageJson, PartialOnUndefinedDeep, PartialOnUndefinedDeepOptions, PascalCase, PascalCasedProperties, PascalCasedPropertiesDeep, PickIndexSignature, PositiveInfinity, Primitive, Promisable, ReadonlyDeep, ReadonlyTuple, OmitIndexSignature as RemoveIndexSignature, Replace, RequireAllOrNone, RequireAtLeastOne, RequireExactlyOne, RequiredKeysOf, Schema, ScreamingSnakeCase, SetNonNullable, SetOptional, SetRequired, SetReturnType, Simplify, SnakeCase, SnakeCasedProperties, SnakeCasedPropertiesDeep, Split, Spread, StringKeyOf, Stringified, TaggedUnion, TsConfigJson, TupleToUnion, Type, TypedArray, Union, UnionToIntersection, UnwrapOpaque, ValueOf, ValueOfDeep, Writable, WritableDeep, primitive };
