import * as type_fest_source_enforce_optional_js from 'type-fest/source/enforce-optional.js';
import { B as BuiltIns, T as Type, e as JsObject, U as Union, f as KeyOfDeep, K as KeyOf, g as ValueOfDeep, V as ValueOf, b as Nullish, M as Multi, O as OmitIndexSignature, d as Maybe } from '../types-3dcf6e43.js';

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

type MapArgs<T, Deep extends boolean> = Type<[
    MapFn<T, Deep>
] | [{
    deep?: Deep;
}, MapFn<T, Deep>]>;
type FilterArgs<T, Deep extends boolean, WithRest extends boolean> = Type<[] | [FilterFn<T, Deep>] | [{
    deep?: Deep;
    withRest?: WithRest;
}, FilterFn<T, Deep>]>;
type MappedResult<T, Deep> = Type<(Deep extends true ? PartialDeep<T> : Partial<T>) & JsObject>;
type FilteredResult<T, Deep, WithRest> = Type<WithRest extends true ? [MappedResult<T, Deep>, MappedResult<T, Deep>] : MappedResult<T, Deep>>;
type MapFn<T, Deep> = (key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>, value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>) => (false | Nullish) | Multi<JsObject> | Multi<[unknown, unknown]>;
type FilterFn<T, Deep> = (entry: {
    key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>;
    value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>;
}) => unknown;
type FindKeyFn<T> = (value: Union<ValueOf<T>>, key: Union<KeyOf<T>>) => unknown;

declare const clear: (obj: object) => object;
declare const deepcopy: <T extends object>(obj: T, hashmap?: WeakMap<object, any>) => T;
declare const extend: <T1 extends object, T2 extends JsObject, Writable extends boolean, Configurable extends boolean>(target: T1, props?: Readonly<T2> | undefined, options?: {
    writable?: Writable | undefined;
    configurable?: Configurable | undefined;
} | undefined) => T1 extends Function ? T1 & (Writable & Configurable extends true ? T2 : Readonly<T2>) : ((PickIndexSignature<T1> extends infer T_20 ? { [Key_1 in keyof T_20 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_21 ? { [Key_2 in keyof T_21 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_15 ? { [Key in keyof T_15 as type_fest_source_enforce_optional_js.RequiredFilter<(PickIndexSignature<T1> extends infer T_16 ? { [Key_1 in keyof T_16 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_17 ? { [Key_2 in keyof T_17 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key>]: ((PickIndexSignature<T1> extends infer T_18 ? { [Key_1 in keyof T_18 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_19 ? { [Key_2 in keyof T_19 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key]; } : never) & ((PickIndexSignature<T1> extends infer T_27 ? { [Key_1 in keyof T_27 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_28 ? { [Key_2 in keyof T_28 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_22 ? { [Key_3 in keyof T_22 as type_fest_source_enforce_optional_js.OptionalFilter<(PickIndexSignature<T1> extends infer T_23 ? { [Key_1 in keyof T_23 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_24 ? { [Key_2 in keyof T_24 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key_3>]?: Exclude<((PickIndexSignature<T1> extends infer T_25 ? { [Key_1 in keyof T_25 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_26 ? { [Key_2 in keyof T_26 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key_3], undefined> | undefined; } : never) extends infer T ? { [KeyType_1 in keyof T]: (((PickIndexSignature<T1> extends infer T_6 ? { [Key_1 in keyof T_6 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_7 ? { [Key_2 in keyof T_7 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_1 ? { [Key in keyof T_1 as type_fest_source_enforce_optional_js.RequiredFilter<(PickIndexSignature<T1> extends infer T_2 ? { [Key_1 in keyof T_2 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_3 ? { [Key_2 in keyof T_3 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key>]: ((PickIndexSignature<T1> extends infer T_4 ? { [Key_1 in keyof T_4 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_5 ? { [Key_2 in keyof T_5 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key]; } : never) & ((PickIndexSignature<T1> extends infer T_13 ? { [Key_1 in keyof T_13 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_14 ? { [Key_2 in keyof T_14 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_8 ? { [Key_3 in keyof T_8 as type_fest_source_enforce_optional_js.OptionalFilter<(PickIndexSignature<T1> extends infer T_9 ? { [Key_1 in keyof T_9 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_10 ? { [Key_2 in keyof T_10 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key_3>]?: Exclude<((PickIndexSignature<T1> extends infer T_11 ? { [Key_1 in keyof T_11 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_12 ? { [Key_2 in keyof T_12 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key_3], undefined> | undefined; } : never))[KeyType_1]; } : never;
declare const findkey: <T extends object>(obj: T, predicate?: FindKeyFn<T>) => Maybe<KeyOf<T>>;
declare const map: <T extends JsObject, Deep extends boolean>(obj: T, ...args: MapArgs<T, Deep>) => MappedResult<T, Deep>;
declare const filter: <T extends JsObject, Deep extends boolean, WithRest extends boolean>(obj: T, ...args: FilterArgs<T, Deep, WithRest>) => FilteredResult<T, Deep, WithRest>;

export { clear, deepcopy, extend, filter, findkey, map };
