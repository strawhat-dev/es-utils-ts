import '../conditional-keys.d-ac881611.js';
import { S as Simplify, O as OmitIndexSignature, U as Union, K as KeyOf, e as JsObject, T as Type, V as ValueOf, b as Nullish, d as Multi, f as KeyOfDeep, g as ValueOfDeep } from '../types-5f7dc540.js';
import { P as PartialDeep } from '../partial-deep.d-c532d293.js';
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

type PropsFn = <T extends object>(obj: T, options?: PropsOptions) => Union<KeyOf<T>>;
type PropsOptions = {
    /**
     * if `true`, include base `Object.prototype` when
     * traversing up the prototype chain for properties
     * @defaultValue `false`
     */
    objectPrototype?: boolean;
};
type PopFn = {
    <T extends JsObject>(obj: Readonly<T>): T[KeyOf<T>];
    <T extends object>(obj: Readonly<T>): T[keyof T];
    <T extends JsObject, Key extends KeyOf<T>>(obj: Readonly<T>, key: Key): T[Key];
    <T extends object, Key extends keyof T>(obj: Readonly<T>, key: Key): T[Key];
};
type ClearFn = <T extends object>(obj: Readonly<T>, options?: Omit<KeyIterationOptions, 'inherited'>) => Partial<T>;
type ExtendFn = {
    <T extends JsObject>(props: Readonly<T>): Readonly<T>;
    <T1 extends JsObject, T2 extends JsObject>(obj: Readonly<T1>, props: Readonly<T2>): ExtendedResult<T1, Readonly<T2>>;
    <T1 extends object, T2 extends JsObject>(obj: Readonly<T1>, props: Readonly<T2>): ExtendedResult<T1, Readonly<T2>>;
    <T1 extends JsObject, T2 extends JsObject, Options extends ExtendOptions>(obj: Readonly<T1>, props: Readonly<T2>, options: Options): ExtendedResult<T1, Options['configurable'] & Options['writable'] extends true ? T2 : Readonly<T2>>;
    <T1 extends object, T2 extends JsObject, Options extends ExtendOptions>(obj: Readonly<T1>, props: Readonly<T2>, options: Options): ExtendedResult<T1, Options['configurable'] & Options['writable'] extends true ? T2 : Readonly<T2>>;
};
type ExtendOptions = {
    /**
     * if `true`, returns a new object instead of mutating (deep copy).
     * @defaultValue `false`
     */
    copy?: boolean;
    /**
     * if `true`, this property shows up during enumeration
     * of the properties on the corresponding object.
     * @defaultValue `false`
     */
    enumerable?: boolean;
    /**
     * if `true`, the value associated with the property
     * may be changed with an assignment operator.
     * @defaultValue `false`
     */
    writable?: boolean;
    /**
     * if `true`, the type of this property descriptor may be changed
     * and/or the property may be deleted from the corresponding object.
     * @defaultValue `false`
     */
    configurable?: boolean;
};
type ExtendedResult<T1, T2> = Type<T1 extends Function ? T1 & Simplify<T2> : Merge<T1, T2>>;
type FindKeyFn = {
    <T extends object>(obj: Readonly<T>): KeyOf<Readonly<T>> | undefined;
    <T extends object>(obj: Readonly<T>, predicate: (value: Union<ValueOf<Readonly<T>>>, key: Union<KeyOf<Readonly<T>>>) => unknown): KeyOf<Readonly<T>> | undefined;
    <T extends object, Options extends ObjectIterationOptions>(obj: Readonly<T>, predicate: (value: Union<ResolvedValues<T, Options>>, key: Union<ResolvedKeys<T, Options>>) => unknown, options: Options): Type<(Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>) | undefined>;
    <T extends object, Options extends ObjectIterationOptions>(obj: Readonly<T>, options: Options, predicate: (value: Union<ResolvedValues<T, Options>>, key: Union<ResolvedKeys<T, Options>>) => unknown): Type<(Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>) | undefined>;
};
type MapFn = {
    <T extends JsObject>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends object>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends JsObject, Options extends ObjectIterationOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends object, Options extends ObjectIterationOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends JsObject, Options extends ObjectIterationOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
    <T extends object, Options extends ObjectIterationOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
};
type MapCallback<T, Options extends ObjectIterationOptions = {}> = (key: Union<ResolvedKeys<T, Options>>, value: Union<ResolvedValues<T, Options>>) => (false | Nullish) | Multi<JsObject<unknown>> | Multi<[unknown, unknown]>;
type MappedResult<T, Options extends ObjectIterationOptions = {}> = SimplifyDeep<ResolvedResult<T, Options> & JsObject>;
type FilterFn = {
    <T extends JsObject>(obj: Readonly<T>): T;
    <T extends object>(obj: Readonly<T>): T;
    <T extends JsObject>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>>): FilteredResult<T>;
    <T extends object>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>>): FilteredResult<T>;
    <T extends JsObject, Options extends FilterOptions>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>, Options>, options: Options): FilteredResult<T, Options>;
    <T extends object, Options extends FilterOptions>(obj: Readonly<T>, predicate: FilterPredicate<Readonly<T>, Options>, options: Options): FilteredResult<T, Options>;
    <T extends JsObject, Options extends FilterOptions>(obj: Readonly<T>, options: Options, predicate: FilterPredicate<Readonly<T>, Options>): FilteredResult<T, Options>;
    <T extends object, Options extends FilterOptions>(obj: Readonly<T>, options: Options, predicate: FilterPredicate<Readonly<T>, Options>): FilteredResult<T, Options>;
};
type FilterOptions = ObjectIterationOptions & {
    /**
     * if `true`, return a tuple of the results along
     * with the rest of items that were filtered out instead
     * @defaultValue `false`
     */
    withRest?: boolean;
};
type FilterPredicate<T, Options extends FilterOptions = {}> = (entry: {
    key: Union<ResolvedKeys<T, Options>>;
    value: Union<ResolvedValues<T, Options>>;
}) => unknown;
type FilteredResult<T, Options extends FilterOptions = {}> = SimplifyDeep<Options['withRest'] extends true ? [ResolvedResult<T, Options>, ResolvedResult<T, Options>] : ResolvedResult<T, Options>>;
type ResolvedResult<T, Options extends ObjectIterationOptions = {}> = Options['deep'] extends true ? PartialDeep<T> : Partial<T>;
type ResolvedKeys<T, Opts extends ObjectIterationOptions = {}> = Opts['deep'] extends true ? KeyOfDeep<Readonly<T>> : KeyOf<Readonly<T>>;
type ResolvedValues<T, Opts extends ObjectIterationOptions = {}> = Opts['deep'] extends true ? ValueOfDeep<Readonly<T>> : ValueOf<Readonly<T>>;
type ObjectIterationOptions = KeyIterationOptions & {
    /**
     * if `true`, recursively iterate into nested keys and values.
     * *(plain objects only)*
     * @defaultValue `false`
     */
    deep?: boolean;
};
type KeyIterationOptions = {
    /**
     * if `true`, inherited keys *(i.e. those from its prototype chain)*
     * are also included while traversing this object
     * @defaultValue `false`
     */
    inherited?: boolean;
    /**
     * if `true`, non-enumerable keys
     * are also included while traversing this object
     * @defaultValue `false`
     */
    nonEnumerable?: boolean;
};

/**
 * @returns an array of the object's keys, *including inherited ones*
 */
declare const keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
/**
 * @returns an array of **all** of the object's properties *(i.e. including inherited and non-enumerable ones)*
 */
declare const props: PropsFn;
/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value deleted from the object
 */
declare const pop: PopFn;
/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
declare const clear: ClearFn;
/**
 * Convenience wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be provided as the third argument,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 *
 * Note: This would apply to all of the given properties however,
 * as opposed to a per-property basis with `Object.defineProperties`.
 */
declare const extend: ExtendFn;
declare const findkey: FindKeyFn;
declare const map: MapFn;
declare const filter: FilterFn;
declare const object: Readonly<{
    readonly clear: ClearFn;
    readonly extend: ExtendFn;
    readonly filter: FilterFn;
    readonly findkey: FindKeyFn;
    readonly keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
    readonly map: MapFn;
    readonly pop: PopFn;
    readonly props: PropsFn;
}>;

export { clear, extend, filter, findkey, keysIn, map, object, pop, props };
