import { Union, KeyOf, JsObject, Merge, Maybe, Multi, Nullish, Type, ReadonlyDeep, KeyOfDeep, ValueOfDeep, ValueOf } from '../types.js';
import { S as Simplify, P as PartialDeep } from '../conditional-except.d-9c5a45d7.js';
import { SimplifyDeep } from 'type-fest/source/merge-deep.js';
import './writable.js';
import 'type-fest/source/async-return-type.js';

type PropsFn = <T extends object>(obj: T, options?: PropsOptions) => Union<KeyOf<T>>;
type PropsOptions = {
    /**
     * If `true`, properties of `Object.prototype` are included
     * when traversing up the prototype chain; otherwise omitted.
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
    <T1 extends JsObject, T2 extends JsObject, Options extends ExtendOptions<T2>>(obj: Readonly<T1>, props: Readonly<T2>, options: Options): ExtendedResult<T1, T2, Options>;
    <T1 extends object, T2 extends JsObject, Options extends ExtendOptions<T2>>(obj: Readonly<T1>, props: Readonly<T2>, options: Options): ExtendedResult<T1, T2, Options>;
};
type ExtendOptions<T = {}> = {
    /**
     * If `true`, return a new object instead
     * of mutating the current one. *(deep copy)*
     * @defaultValue `false`
     */
    copy?: boolean;
    /**
     * If provided, the properties listed will show up
     * during the enumeration of the corresponding object. \
     * *(Applied to **all** properties if `true`)*
     * @defaultValue `false`
     */
    enumerable?: boolean | KeyOf<T>[];
    /**
     * If provided, the values associated may
     * be changed with an assignment operator. \
     * *(Applied to **all** properties if `true`)*
     * @defaultValue `false`
     */
    writable?: boolean | KeyOf<T>[];
    /**
     * If provided, the types of these property descriptors may be changed
     * and the properties may be deleted from the corresponding object. \
     * *(Applied to **all** properties if `true`)*
     * @defaultValue `false`
     */
    configurable?: boolean | KeyOf<T>[];
} & Pick<ObjectOptions, 'freeze'>;
type ExtendedResult<T1, T2, Options extends ExtendOptions = {}, Props = Options['configurable'] & Options['writable'] extends true ? T2 : Readonly<T2>, Result = T1 extends Function ? T1 & Simplify<Props> : Merge<T1, Props>> = Options['freeze'] extends true ? Readonly<Result> : Result;
type FindKeyFn = {
    <T extends object>(obj: Readonly<T>): Maybe<KeyOf<Readonly<T>>>;
    <T extends object>(obj: Readonly<T>, predicate: FindKeyCallback<T>): Maybe<KeyOf<Readonly<T>>>;
    <T extends object, Options extends FindKeyOptions>(obj: Readonly<T>, predicate: FindKeyCallback<T, Options>, options: Options): Maybe<Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>>;
    <T extends object, Options extends FindKeyOptions>(obj: Readonly<T>, options: Options, predicate: FindKeyCallback<T, Options>): Maybe<Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>>;
};
type FindKeyOptions = Omit<ObjectOptions, 'freeze'>;
type FindKeyCallback<T, Options extends FindKeyOptions = {}> = Union<(value: Union<ResolvedValues<T, Options>>, key: Union<ResolvedKeys<T, Options>>) => boolean>;
type MapFn = {
    <T extends JsObject>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends object>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends JsObject, Options extends ObjectOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends object, Options extends ObjectOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends JsObject, Options extends ObjectOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
    <T extends object, Options extends ObjectOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
};
type MapCallback<T, Options extends ObjectOptions = {}> = Union<(key: Union<ResolvedKeys<T, Options>>, value: Union<ResolvedValues<T, Options>>) => Multi<[unknown, unknown]> | JsObject<unknown> | (false | Nullish)>;
type MappedResult<T, Options extends ObjectOptions = {}> = SimplifyDeep<ResolvedResult<T, Options> & JsObject>;
type FilterFn = {
    <T extends JsObject>(obj: Readonly<T>): T;
    <T extends object>(obj: Readonly<T>): T;
    <T extends JsObject>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>>): FilteredResult<T>;
    <T extends object>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>>): FilteredResult<T>;
    <T extends JsObject, Options extends FilterOptions>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>, Options>, options: Options): FilteredResult<T, Options>;
    <T extends object, Options extends FilterOptions>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>, Options>, options: Options): FilteredResult<T, Options>;
    <T extends JsObject, Options extends FilterOptions>(obj: Readonly<T>, options: Options, predicate: FilterCallback<Readonly<T>, Options>): FilteredResult<T, Options>;
    <T extends object, Options extends FilterOptions>(obj: Readonly<T>, options: Options, predicate: FilterCallback<Readonly<T>, Options>): FilteredResult<T, Options>;
};
type FilterOptions = ObjectOptions & {
    /**
     * if `true`, changes the resulting return
     * type to a tuple of 2 objects to include the
     * properties that were omitted as well.
     * @defaultValue `false`.
     */
    withRest?: boolean;
};
type FilterCallback<T, Options extends FilterOptions = {}> = Union<(entry: {
    key: Union<ResolvedKeys<T, Options>>;
    value: Union<ResolvedValues<T, Options>>;
}) => boolean>;
type FilteredResult<T, Options extends FilterOptions = {}> = SimplifyDeep<Options['withRest'] extends true ? [ResolvedResult<T, Options>, ResolvedResult<T, Options>] : ResolvedResult<T, Options>>;
type KeyIterationOptions = {
    /**
     * if `true`, inherited keys *(i.e. those from its prototype chain)*
     * are also included while traversing this object
     * @defaultValue `false`
     */
    inherited?: boolean;
    /**
     * if `true`, non-enumerable keys are also
     * included while traversing this object
     * @defaultValue `false`
     */
    nonEnumerable?: boolean;
};
type ObjectOptions = KeyIterationOptions & {
    /**
     * if `true`, changes the usage to recursively iterate
     * into nested keys and values *(on plain objects only)*.
     * @defaultValue `false`
     */
    deep?: boolean;
    /**
     * if `true`, freeze the resulting object.
     * @defaultValue `false`
     */
    freeze?: boolean;
};
type ResolvedResult<T, Options extends ObjectOptions = {}, Result = Options['deep'] extends true ? PartialDeep<T> : Partial<T>> = Type<Options['freeze'] extends true ? Options['deep'] extends true ? ReadonlyDeep<Result> : Readonly<Result> : Result>;
type ResolvedKeys<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true ? KeyOfDeep<Readonly<T>> : KeyOf<Readonly<T>>;
type ResolvedValues<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true ? ValueOfDeep<Readonly<T>> : ValueOf<Readonly<T>>;

/**
 * @returns an array of the object's keys, including *inherited* ones
 */
declare const keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
/**
 * @returns an array of **all** of the object's properties, including those that are *inherited* and *non-enumerable*
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
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
declare const extend: ExtendFn;
declare const findkey: FindKeyFn;
declare const map: MapFn;
declare const filter: FilterFn;
declare const _: Readonly<{
    clear: ClearFn;
    extend: ExtendFn;
    filter: FilterFn;
    findkey: FindKeyFn;
    keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
    map: MapFn;
    pop: PopFn;
    props: PropsFn;
}>;

export { _, clear, extend, filter, findkey, keysIn, map, pop, props };
