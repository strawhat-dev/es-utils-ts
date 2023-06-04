import type { Composite, JsObject, KeyOf, KeyOfDeep, Maybe, Merge, Multi, Nullish, PartialDeep, ReadonlyDeep, Simplify, SimplifyDeep, Type, Union, ValueOf, ValueOfDeep, Writable } from '../type-utils.js';
export type ClearFn = <T extends JsObject>(obj: T, options?: Omit<KeyIterationOptions, 'inherited'>) => Partial<T>;
export type PopFn = {
    <T extends JsObject>(obj: Readonly<T>): T[KeyOf<T>];
    <T extends JsObject, Key extends KeyOf<Readonly<T>>>(obj: Readonly<T>, key: Key): T[Key];
    <T extends object>(obj: Readonly<T>): T[keyof T];
    <T extends object, Key extends keyof Readonly<T>>(obj: Readonly<T>, key: Key): T[Key];
};
export type KeyDispatcher = {
    <T extends object>(obj: Readonly<T>): KeyOf<T>[];
    <T extends object, Options extends KeyDispatcherOptions>(obj: Readonly<T>, options?: Options): KeyDispatcherResult<T, Options>;
    <T extends object>(obj: Readonly<T>, predicate: (key: KeyOf<T>) => unknown): KeyOf<T>[];
    <T extends object, Options extends KeyDispatcherOptions>(obj: Readonly<T>, options: Omit<Options, 'definedOnly'>, predicate: (key: KeyOf<T>) => unknown): KeyDispatcherResult<T, Options>;
};
type KeyDispatcherOptions = KeyIterationOptions & {
    /**
     * if `true`, retrieve *only* keys where the *corresponding values*
     * are **not any of** `undefined`, `null`, `NaN`, or `false`.
     * - *Note: Replaces usage of the filter callback parameter*
     * @defaultValue `false`
     */
    definedOnly?: boolean;
};
type KeyDispatcherResult<T, Options extends KeyDispatcherOptions, _root = true> = Type<(Options['inherited'] extends true ? T extends {
    __proto__: infer Proto;
} ? Exclude<KeyOf<T>, '__proto__'> | KeyDispatcherResult<Proto, Options, false>[number] : _root extends true ? Union<KeyOf<T>> : KeyOf<T> : KeyOf<T>)[]>;
export type Extender = {
    <T extends JsObject>(props: Readonly<T>): Readonly<T>;
    <Base extends JsObject, Props extends JsObject>(obj: Readonly<Base>, props: Readonly<Props>): ExtendedResult<Base, Readonly<Props>>;
    <Base extends object, Props extends JsObject>(obj: Readonly<Base>, props: Readonly<Props>): ExtendedResult<Base, Readonly<Props>>;
    <Base extends JsObject, Props extends JsObject, Options extends ExtendOptions<Props>>(obj: Readonly<Base>, props: Readonly<Props>, options: Options): ExtendedResult<Base, Props, Options>;
    <Base extends object, Props extends JsObject, Options extends ExtendOptions<Props>>(obj: Readonly<Base>, props: Readonly<Props>, options: Options): ExtendedResult<Base, Props, Options>;
};
export type ExtendOptions<Props = {}> = {
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
    enumerable?: boolean | readonly KeyOf<Props>[];
    /**
     * If provided, the values associated may
     * be changed with an assignment operator. \
     * *(Applied to **all** properties if `true`)*
     * @defaultValue `false`
     */
    writable?: boolean | readonly KeyOf<Props>[];
    /**
     * If provided, the types of these property descriptors may be changed
     * and the properties may be deleted from the corresponding object. \
     * *(Applied to **all** properties if `true`)*
     * @defaultValue `false`
     */
    configurable?: boolean | readonly KeyOf<Props>[];
} & Pick<ObjectOptions, 'freeze'>;
type ExtendedResult<T1, T2, Options extends ExtendOptions<T2> = {}, Props = Options['configurable'] & Options['writable'] extends true ? T2 : Options['configurable'] & Options['writable'] extends readonly (infer P)[] ? P extends keyof T2 ? Writable<Readonly<T2>, P> : never : Readonly<T2>, Result = T1 extends Function ? T1 & Simplify<Props> : Merge<T1, Composite<Props>>> = Options['freeze'] extends true ? Readonly<Result> : Result;
export type FindKeyFn = {
    <T extends object>(obj: Readonly<T>): Maybe<KeyOf<Readonly<T>>>;
    <T extends object>(obj: Readonly<T>, predicate: FindKeyCallback<T>): Maybe<KeyOf<Readonly<T>>>;
    <T extends object, Options extends FindKeyOptions>(obj: Readonly<T>, predicate: FindKeyCallback<T, Options>, options: Options): Maybe<Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>>;
    <T extends object, Options extends FindKeyOptions>(obj: Readonly<T>, options: Options, predicate: FindKeyCallback<T, Options>): Maybe<Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>>;
};
type FindKeyOptions = Omit<ObjectOptions, 'freeze'>;
type FindKeyCallback<T, Options extends FindKeyOptions = {}> = Union<(value: Union<ResolvedValues<T, Options>>, key: Union<ResolvedKeys<T, Options>>) => boolean>;
export type Mapper = {
    <T extends JsObject>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends object>(obj: Readonly<T>, callback: MapCallback<Readonly<T>>): MappedResult<T>;
    <T extends JsObject, Options extends ObjectOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends object, Options extends ObjectOptions>(obj: Readonly<T>, callback: MapCallback<Readonly<T>, Options>, options: Options): MappedResult<T, Options>;
    <T extends JsObject, Options extends ObjectOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
    <T extends object, Options extends ObjectOptions>(obj: Readonly<T>, options: Options, callback: MapCallback<Readonly<T>, Options>): MappedResult<T, Options>;
};
type MapCallback<T, Options extends ObjectOptions = {}> = Union<(key: Union<ResolvedKeys<T, Options>>, value: Union<ResolvedValues<T, Options>>) => Multi<[unknown, unknown]> | JsObject<unknown> | (false | Nullish)>;
type MappedResult<T, Options extends ObjectOptions = {}> = SimplifyDeep<ResolvedResult<T, Options> & JsObject>;
export type Filterer = {
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
type KeyIterationOptions = {
    /**
     * if `true`, *inherited* keys *(i.e. those from its prototype chain)*
     * are also included while traversing this object
     * @defaultValue `false`
     */
    inherited?: boolean;
    /**
     * if `true`, *non-enumerable* keys are also
     * included while traversing this object
     * @defaultValue `false`
     */
    nonEnumerable?: boolean;
    /**
     * if `true`, *non-enumerable* keys are also
     * included while traversing this object
     * - *alias for `'nonEnumerable'`*
     * @defaultValue `false`
     */
    hidden?: boolean;
};
type ResolvedResult<T, Options extends ObjectOptions = {}, Result = Options['deep'] extends true ? PartialDeep<T> : Partial<T>> = Type<Options['freeze'] extends true ? Options['deep'] extends true ? ReadonlyDeep<Result> : Readonly<Result> : Result>;
type ResolvedKeys<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true ? KeyOfDeep<Readonly<T>> : KeyOf<Readonly<T>>;
type ResolvedValues<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true ? ValueOfDeep<Readonly<T>> : ValueOf<Readonly<T>>;
export {};