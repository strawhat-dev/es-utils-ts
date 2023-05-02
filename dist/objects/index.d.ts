import { S as Simplify, O as OmitIndexSignature, B as BuiltIns, U as Union, V as ValueOf, K as KeyOf, e as JsObject, T as Type, f as KeyOfDeep, g as ValueOfDeep, b as Nullish, d as Multi } from '../types-1940722b.js';
import { SimplifyDeep } from 'type-fest/source/merge-deep.js';

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
@see PartialDeep
*/
type PartialDeepOptions = {
	/**
	Whether to affect the individual elements of arrays and tuples.

	@default false
	*/
	readonly recurseIntoArrays?: boolean;
};

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import type {PartialDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14;
		fontColor: '#000000';
		fontWeight: 400;
	}
	autocomplete: false;
	autosave: true;
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

By default, this does not affect elements in array and tuple types. You can change this by passing `{recurseIntoArrays: true}` as the second type argument:

```
import type {PartialDeep} from 'type-fest';

interface Settings {
	languages: string[];
}

const partialSettings: PartialDeep<Settings, {recurseIntoArrays: true}> = {
	languages: [undefined]
};
```

@category Object
@category Array
@category Set
@category Map
*/
type PartialDeep<T, Options extends PartialDeepOptions = {}> = T extends BuiltIns
	? T
	: T extends Map<infer KeyType, infer ValueType>
		? PartialMapDeep<KeyType, ValueType, Options>
		: T extends Set<infer ItemType>
			? PartialSetDeep<ItemType, Options>
			: T extends ReadonlyMap<infer KeyType, infer ValueType>
				? PartialReadonlyMapDeep<KeyType, ValueType, Options>
				: T extends ReadonlySet<infer ItemType>
					? PartialReadonlySetDeep<ItemType, Options>
					: T extends ((...arguments: any[]) => unknown)
						? T | undefined
						: T extends object
							? T extends ReadonlyArray<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
								? Options['recurseIntoArrays'] extends true
									? ItemType[] extends T // Test for arrays (non-tuples) specifically
										? readonly ItemType[] extends T // Differentiate readonly and mutable arrays
											? ReadonlyArray<PartialDeep<ItemType | undefined, Options>>
											: Array<PartialDeep<ItemType | undefined, Options>>
										: PartialObjectDeep<T, Options> // Tuples behave properly
									: T // If they don't opt into array testing, just use the original type
								: PartialObjectDeep<T, Options>
							: unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s and as inputs. Internal helper for `PartialDeep`.
*/
type PartialMapDeep<KeyType, ValueType, Options extends PartialDeepOptions> = {} & Map<PartialDeep<KeyType, Options>, PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialSetDeep<T, Options extends PartialDeepOptions> = {} & Set<PartialDeep<T, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlyMapDeep<KeyType, ValueType, Options extends PartialDeepOptions> = {} & ReadonlyMap<PartialDeep<KeyType, Options>, PartialDeep<ValueType, Options>>;

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialReadonlySetDeep<T, Options extends PartialDeepOptions> = {} & ReadonlySet<PartialDeep<T, Options>>;

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialObjectDeep<ObjectType extends object, Options extends PartialDeepOptions> = {
	[KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType], Options>
};

type FindKey = <T extends object>(obj: Readonly<T>, predicate?: (value: Union<ValueOf<Readonly<T>>>, key: Union<KeyOf<Readonly<T>>>) => unknown) => KeyOf<Readonly<T>> | undefined;
interface Mapper {
    <T extends JsObject>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends object>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends JsObject, Deep extends boolean = false>(obj: Readonly<T>, options: {
        deep?: Deep;
    }, callback: MapCallback<Readonly<T>, Deep>): MappedResult<T, Deep>;
    <T extends object, Deep extends boolean = false>(obj: Readonly<T>, options: {
        deep?: Deep;
    }, callback: MapCallback<Readonly<T>, Deep>): MappedResult<T, Deep>;
}
interface Filterer {
    <T extends JsObject>(obj: Readonly<T>): T;
    <T extends object>(obj: Readonly<T>): T;
    <T extends JsObject>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>>): FilteredResult<T>;
    <T extends object>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>>): FilteredResult<T>;
    <T extends JsObject, Deep extends boolean = false, WithRest extends boolean = false>(obj: Readonly<T>, options: {
        deep?: Deep;
        withRest?: WithRest;
    }, predicate: FilterPredicate<Readonly<T>, Deep>): FilteredResult<T, Deep, WithRest>;
    <T extends object, Deep extends boolean = false, WithRest extends boolean = false>(obj: Readonly<T>, options: {
        deep?: Deep;
        withRest?: WithRest;
    }, predicate: FilterPredicate<Readonly<T>, Deep>): FilteredResult<T, Deep, WithRest>;
}
interface Extender {
    <T extends JsObject>(props: Readonly<T>): Merge<JsObject, Readonly<T>>;
    <T1 extends JsObject, T2 extends JsObject>(obj: Readonly<T1>, props: Readonly<T2>): ExtendedResult<T1, Readonly<T2>>;
    <T1 extends object, T2 extends JsObject>(obj: Readonly<T1>, props: Readonly<T2>): ExtendedResult<T1, Readonly<T2>>;
    <T1 extends JsObject, T2 extends JsObject, Writable extends boolean = false, Configurable extends boolean = false>(obj: Readonly<T1>, props: Readonly<T2>, options: PropertyOptions<Writable, Configurable>): ExtendedResult<T1, Writable & Configurable extends true ? T2 : Readonly<T2>>;
    <T1 extends object, T2 extends JsObject, Writable extends boolean = false, Configurable extends boolean = false>(obj: Readonly<T1>, props: Readonly<T2>, options: PropertyOptions<Writable, Configurable>): ExtendedResult<T1, Writable & Configurable extends true ? T2 : Readonly<T2>>;
}
type ExtendedResult<T1, T2> = Type<T1 extends Function ? T1 & Simplify<T2> : Merge<T1, T2>>;
type MappedResult<T, Deep = false> = SimplifyDeep<(Deep extends true ? PartialDeep<T> : Partial<T>) & JsObject>;
type FilteredResult<T, Deep = false, WithRest = false> = Type<WithRest extends true ? [MappedResult<T, Deep>, MappedResult<T, Deep>] : MappedResult<T, Deep>>;
type MapCallback<T, Deep = false> = (key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>, value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>) => (false | Nullish) | Multi<JsObject> | Multi<[unknown, unknown]>;
type FilterPredicate<T, Deep = false> = (entry: {
    key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>;
    value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>;
}) => unknown;
type PropertyOptions<Writable, Configurable> = {
    /**
     * if `true`, the value associated with the property
     * may be changed with an assignment operator.
     * @defaultValue `false`
     */
    writable?: Writable;
    /**
     * if `true`, the type of this property descriptor may be changed
     * and/or the property may be deleted from the corresponding object.
     * @defaultValue `false`
     */
    configurable?: Configurable;
    /**
     * if `true`, this property shows up during enumeration
     * of the properties on the corresponding object.
     * @defaultValue `false`
     */
    enumerable?: boolean;
};

declare const clear: (obj: object) => object;
declare const findkey: FindKey;
declare const map: Mapper;
declare const filter: Filterer;
declare const extend: Extender;

export { clear, extend, filter, findkey, map };
