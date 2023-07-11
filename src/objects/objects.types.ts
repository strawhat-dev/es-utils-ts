import type { Merge, PartialDeep, Simplify, UnionToIntersection, Writable } from 'type-fest';
import type {
  Fn,
  JsObject,
  KeyOf,
  KeyOfDeep,
  Maybe,
  Multi,
  NullishOrFalse,
  SimplifyDeep,
  Spread,
  Union,
  Value,
  ValueOf,
  ValueOfDeep,
} from '../type-utils.js';

// keys
export type KeyDispatcher = {
  <T extends object>(obj: Readonly<T>): KeyOf<T>[];

  <T extends object, Options extends KeyDispatcherOptions>(
    obj: Readonly<T>,
    options: Options,
  ): KeyDispatcherResult<T, Options>;

  <T extends object>(obj: Readonly<T>, predicate: (key: KeyOf<T>) => unknown): KeyOf<T>[];

  <T extends object, Options extends KeyIterationOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: (key: KeyOf<T>) => unknown,
  ): KeyDispatcherResult<T, Options>;
};

type KeyDispatcherOptions = Merge<
  KeyIterationOptions,
  {
    /**
     * if `true`, retrieve *only* keys where the *corresponding values*
     * are **not any of** `undefined`, `null`, `NaN`, or `false`.
     * - *Note: Replaces usage of the filter callback parameter*
     * @defaultValue `false`
     */
    definedOnly?: boolean;
  }
>;

type KeyDispatcherResult<
  T,
  Options extends KeyDispatcherOptions,
  _root = true,
> = (Options['inherited'] extends true
  ? T extends { __proto__: infer Proto }
    ? Exclude<KeyOf<T>, '__proto__'> | KeyDispatcherResult<Proto, Options, false>[number]
    : _root extends true
    ? Union<KeyOf<T>>
    : KeyOf<T>
  : KeyOf<T>)[];

// extend
export type Extender = {
  <T extends JsObject>(props: Readonly<T>): Readonly<T>;

  <Base extends JsObject, Props extends JsObject>(
    obj: Readonly<Base>,
    props: Readonly<Props>,
  ): ExtendedResult<Base, Readonly<Props>>;

  <Base extends object, Props extends JsObject>(
    obj: Base,
    props: Readonly<Props>,
  ): ExtendedResult<Base, Readonly<Props>>;

  <Base extends JsObject, Props extends JsObject, Options extends ExtendOptions<Props>>(
    obj: Readonly<Base>,
    props: Readonly<Props>,
    options: Options,
  ): ExtendedResult<Base, Props, Options>;

  <Base extends object, Props extends JsObject, Options extends ExtendOptions<Props>>(
    obj: Base,
    props: Readonly<Props>,
    options: Options,
  ): ExtendedResult<Base, Props, Options>;
};

export type ExtendOptions<Props = {}> = {
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
};

type ExtendedResult<
  T,
  Props,
  Options extends ExtendOptions<Props> = {},
  ResolvedProps = Options['configurable'] & Options['writable'] extends true
    ? Props
    : Spread<Options['writable'], Options['configurable']> extends readonly (infer P)[]
    ? P extends keyof Props
      ? Writable<Readonly<Props>, P>
      : never
    : Readonly<Props>,
> = T extends Function
  ? T & Simplify<UnionToIntersection<ResolvedProps>>
  : Simplify<UnionToIntersection<Merge<T, ResolvedProps>>>;

// pop
export type PopFn = {
  <T extends JsObject>(obj: Readonly<T>): ValueOf<T>;
  <T extends object>(obj: Readonly<T>): ValueOf<T>;

  <T extends JsObject, Key extends KeyOf<T>>(obj: Readonly<T>, key: Key): T[Key];
  <T extends object, Key extends KeyOf<T>>(
    obj: Readonly<T>,
    key: Key,
  ): T[Key extends keyof T ? Key : keyof T];
};

// findkey
export type FindKeyFn = {
  <T extends object>(obj: Readonly<T>): Maybe<KeyOf<T>>;

  <T extends object>(obj: Readonly<T>, predicate: FindKeyCallback<T>): Maybe<KeyOf<T>>;

  <T extends object, Options extends ObjectOptions>(
    obj: Readonly<T>,
    predicate: FindKeyCallback<T, Options>,
    options: Options,
  ): Maybe<
    Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>
  >;

  <T extends object, Options extends ObjectOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: FindKeyCallback<T, Options>,
  ): Maybe<
    Options['inherited'] extends true ? Union<ResolvedKeys<T, Options>> : ResolvedKeys<T, Options>
  >;
};

type FindKeyCallback<T, Options extends ObjectOptions = {}> = Union<
  (value: Union<ResolvedValues<T, Options>>, key: Union<ResolvedKeys<T, Options>>) => boolean
>;

// map
export type MapCallback<T> = (
  key: KeyOf<T>,
  value: ValueOf<T>,
) =>
  | Multi<readonly [Union<KeyOf<T>> | NullishOrFalse, Value]>
  | Readonly<{ [k in KeyOf<T>]: Value }>
  | JsObject
  | NullishOrFalse;

export type MappedResult<
  Mapper extends Fn,
  Resolved = ReturnType<Mapper>,
> = Resolved extends readonly [unknown, unknown][]
  ? MappedResult<() => Resolved[number]>
  : Resolved extends readonly [infer key, infer value]
  ? { [k in key as key extends PropertyKey ? key : never]: value }
  : Resolved extends Readonly<JsObject>
  ? Resolved
  : never;

// filter
export type FilterFn = {
  <T extends JsObject>(obj: Readonly<T>): T;

  <T extends object>(obj: Readonly<T>): T;

  <T extends JsObject>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>>): FilteredResult<T>;

  <T extends object>(obj: Readonly<T>, predicate: FilterCallback<Readonly<T>>): FilteredResult<T>;

  <T extends JsObject, Options extends FilterOptions>(
    obj: Readonly<T>,
    predicate: FilterCallback<Readonly<T>, Options>,
    options: Options,
  ): FilteredResult<T, Options>;

  <T extends object, Options extends FilterOptions>(
    obj: Readonly<T>,
    predicate: FilterCallback<Readonly<T>, Options>,
    options: Options,
  ): FilteredResult<T, Options>;

  <T extends JsObject, Options extends FilterOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: FilterCallback<Readonly<T>, Options>,
  ): FilteredResult<T, Options>;

  <T extends object, Options extends FilterOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: FilterCallback<Readonly<T>, Options>,
  ): FilteredResult<T, Options>;
};

type FilterOptions = Merge<
  ObjectOptions,
  {
    /**
     * if `true`, changes the resulting return
     * type to a tuple of 2 objects to include the
     * properties that were omitted as well.
     * @defaultValue `false`.
     */
    withRest?: boolean;
  }
>;

type FilterCallback<T, Options extends FilterOptions = {}> = Union<
  (entry: {
    key: Union<ResolvedKeys<T, Options>>;
    value: Union<ResolvedValues<T, Options>>;
  }) => boolean
>;

type FilteredResult<
  T,
  Opts extends FilterOptions = {},
  Resolved = Opts['deep'] extends true ? PartialDeep<T> : Partial<T>,
> = SimplifyDeep<Opts['withRest'] extends true ? [Resolved, Resolved] : Resolved>;

// common
export type ObjectOptions = Merge<
  KeyIterationOptions,
  {
    /**
     * if `true`, changes the usage to recursively iterate
     * into nested keys and values *(on plain objects only)*.
     * @defaultValue `false`
     */
    deep?: boolean;
  }
>;

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

type ResolvedKeys<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true
  ? KeyOfDeep<Readonly<T>>
  : KeyOf<Readonly<T>>;

type ResolvedValues<T, Opts extends ObjectOptions = {}> = Opts['deep'] extends true
  ? ValueOfDeep<Readonly<T>>
  : ValueOf<Readonly<T>>;
