import * as type_fest_source_enforce_optional_js from 'type-fest/source/enforce-optional.js';
import { S as Simplify, O as OmitIndexSignature, g as Union, K as KeyOf, V as ValueOf, e as NullishFalse, M as Multi, f as JsObject, T as Type, b as Maybe } from '../types-1a12439f.js';

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

type MappedResult<T, WithChainedMethods> = ExtendedObject<Partial<T>, WithChainedMethods>;
type FilteredResult<T, WithRest, WithChainedMethods, Result = ExtendedObject<Partial<T>, WithChainedMethods>> = WithRest extends true ? [Result, Result] : Result;
type MapArgs<T, WithChainedMethods extends boolean, Options = {
    deep?: boolean;
    chainMethods?: WithChainedMethods;
}> = [MapFn<T>] | [Options, MapFn<T>];
type FilterArgs<T, WithRest extends boolean, WithChainedMethods extends boolean, Options = {
    deep?: boolean;
    withRest?: WithRest;
    chainMethods?: WithChainedMethods;
}> = [] | [FilterFn<T>] | [Options, FilterFn<T>];
type MapFn<T> = (key: Union<KeyOf<T>>, value: ValueOf<T>) => NullishFalse | Multi<JsObject> | Multi<[unknown, unknown]>;
type FilterFn<T> = (entry: {
    key: Union<KeyOf<T>>;
    value: ValueOf<T>;
}) => unknown;
type FindKeyFn<T> = (value: ValueOf<T>, key: Union<KeyOf<T>>) => unknown;
type ExtendedObject<T, WithChainedMethods = true> = Type<WithChainedMethods extends true ? Merge<ObjectMethods<T>, T & JsObject> : T & JsObject>;
/** @internal */
type ObjectMethods<T> = {
    findkey: <T extends object>(obj: T, predicate?: FindKeyFn<T>) => Maybe<KeyOf<T>>;
    map: <WithChainedMethods extends boolean = true>(...args: MapArgs<T, WithChainedMethods>) => MappedResult<T, WithChainedMethods>;
    filter: <WithRest extends boolean = false, WithChainedMethods extends boolean = true>(...args: FilterArgs<T, WithRest, WithChainedMethods>) => FilteredResult<T, WithRest, WithChainedMethods>;
};

declare const clear: (obj: object) => object;
declare const deepcopy: <T extends object>(obj: T, hashmap?: WeakMap<object, any>) => T;
declare const extend: <T1 extends object, T2 extends JsObject, Writable extends boolean, Configurable extends boolean>(target: T1, props?: Readonly<T2> | undefined, options?: {
    writable?: Writable | undefined;
    configurable?: Configurable | undefined;
} | undefined) => T1 extends Function ? T1 & (Writable & Configurable extends true ? T2 : Readonly<T2>) : ((PickIndexSignature<T1> extends infer T_20 ? { [Key_1 in keyof T_20 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_21 ? { [Key_2 in keyof T_21 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_15 ? { [Key in keyof T_15 as type_fest_source_enforce_optional_js.RequiredFilter<(PickIndexSignature<T1> extends infer T_16 ? { [Key_1 in keyof T_16 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_17 ? { [Key_2 in keyof T_17 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key>]: ((PickIndexSignature<T1> extends infer T_18 ? { [Key_1 in keyof T_18 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_19 ? { [Key_2 in keyof T_19 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key]; } : never) & ((PickIndexSignature<T1> extends infer T_27 ? { [Key_1 in keyof T_27 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_28 ? { [Key_2 in keyof T_28 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_22 ? { [Key_3 in keyof T_22 as type_fest_source_enforce_optional_js.OptionalFilter<(PickIndexSignature<T1> extends infer T_23 ? { [Key_1 in keyof T_23 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_24 ? { [Key_2 in keyof T_24 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key_3>]?: Exclude<((PickIndexSignature<T1> extends infer T_25 ? { [Key_1 in keyof T_25 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_26 ? { [Key_2 in keyof T_26 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key_3], undefined> | undefined; } : never) extends infer T ? { [KeyType_1 in keyof T]: (((PickIndexSignature<T1> extends infer T_6 ? { [Key_1 in keyof T_6 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_7 ? { [Key_2 in keyof T_7 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_1 ? { [Key in keyof T_1 as type_fest_source_enforce_optional_js.RequiredFilter<(PickIndexSignature<T1> extends infer T_2 ? { [Key_1 in keyof T_2 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_3 ? { [Key_2 in keyof T_3 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key>]: ((PickIndexSignature<T1> extends infer T_4 ? { [Key_1 in keyof T_4 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_5 ? { [Key_2 in keyof T_5 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key]; } : never) & ((PickIndexSignature<T1> extends infer T_13 ? { [Key_1 in keyof T_13 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_14 ? { [Key_2 in keyof T_14 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> extends infer T_8 ? { [Key_3 in keyof T_8 as type_fest_source_enforce_optional_js.OptionalFilter<(PickIndexSignature<T1> extends infer T_9 ? { [Key_1 in keyof T_9 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_10 ? { [Key_2 in keyof T_10 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>, Key_3>]?: Exclude<((PickIndexSignature<T1> extends infer T_11 ? { [Key_1 in keyof T_11 as Key_1 extends keyof PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_1]: PickIndexSignature<T1>[Key_1]; } : never) & PickIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> & (OmitIndexSignature<T1> extends infer T_12 ? { [Key_2 in keyof T_12 as Key_2 extends keyof OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>> ? never : Key_2]: OmitIndexSignature<T1>[Key_2]; } : never) & OmitIndexSignature<Writable & Configurable extends true ? T2 : Readonly<T2>>)[Key_3], undefined> | undefined; } : never))[KeyType_1]; } : never;
declare const findkey: <T extends object>(obj: T, predicate?: FindKeyFn<T> | undefined) => Maybe<KeyOf<T>>;
declare const map: <Result extends JsObject, T = object, WithChainedMethods extends boolean = true>(obj: T, ...args: MapArgs<T, WithChainedMethods>) => T extends Result ? MappedResult<T, WithChainedMethods> : Result;
declare const filter: <Result extends JsObject, T = object, WithRest extends boolean = false, WithChainedMethods extends boolean = true>(obj: T, ...args: FilterArgs<T, WithRest, WithChainedMethods>) => T extends Result ? FilteredResult<T, WithRest, WithChainedMethods> : Result;

export { clear, deepcopy, extend, filter, findkey, map };
