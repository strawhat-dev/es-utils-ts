import type { Merge, PartialDeep, Simplify } from 'type-fest';
import type { SimplifyDeep } from 'type-fest/source/merge-deep.js';
import type {
  JsObject,
  KeyOf,
  KeyOfDeep,
  Multi,
  Nullish,
  Type,
  Union,
  ValueOf,
  ValueOfDeep,
} from '@/types';

export type PropsFn = <T extends object>(
  obj: T,
  options?: PropsOptions
) => Union<KeyOf<T>>;

type PropsOptions = {
  /**
   * if `true`, include base `Object.prototype` when
   * traversing up the prototype chain for properties
   * @defaultValue `false`
   */
  objectPrototype?: boolean;
};

export type PopFn = {
  <T extends JsObject>(obj: Readonly<T>): T[KeyOf<T>];

  <T extends object>(obj: Readonly<T>): T[keyof T];

  <T extends JsObject, Key extends KeyOf<T>>(
    obj: Readonly<T>,
    key: Key
  ): T[Key];

  <T extends object, Key extends keyof T>(obj: Readonly<T>, key: Key): T[Key];
};

export type ClearFn = <T extends object>(
  obj: Readonly<T>,
  options?: Omit<KeyIterationOptions, 'inherited'>
) => Partial<T>;

export type ExtendFn = {
  <T extends JsObject>(props: Readonly<T>): Readonly<T>;

  <T1 extends JsObject, T2 extends JsObject>(
    obj: Readonly<T1>,
    props: Readonly<T2>
  ): ExtendedResult<T1, Readonly<T2>>;

  <T1 extends object, T2 extends JsObject>(
    obj: Readonly<T1>,
    props: Readonly<T2>
  ): ExtendedResult<T1, Readonly<T2>>;

  <T1 extends JsObject, T2 extends JsObject, Options extends ExtendOptions>(
    obj: Readonly<T1>,
    props: Readonly<T2>,
    options: Options
  ): ExtendedResult<
    T1,
    Options['configurable'] & Options['writable'] extends true
      ? T2
      : Readonly<T2>
  >;

  <T1 extends object, T2 extends JsObject, Options extends ExtendOptions>(
    obj: Readonly<T1>,
    props: Readonly<T2>,
    options: Options
  ): ExtendedResult<
    T1,
    Options['configurable'] & Options['writable'] extends true
      ? T2
      : Readonly<T2>
  >;
};

export type ExtendOptions = {
  /**
   * if `true`, return a new object instead
   * of mutating the current one. *(deep copy)*
   * @defaultValue `false`
   */
  copy?: boolean;
  /**
   * if `true`, properties show up during the
   * enumeration of the corresponding object.
   * @defaultValue `false`
   */
  enumerable?: boolean;
  /**
   * if `true`, the values associated may
   * be changed with an assignment operator.
   * @defaultValue `false`
   */
  writable?: boolean;
  /**
   * if `true`, the types of these property descriptors may be changed
   * and/or the properties may be deleted from the corresponding object.
   * @defaultValue `false`
   */
  configurable?: boolean;
};

type ExtendedResult<T1, T2> = Type<
  T1 extends Function ? T1 & Simplify<T2> : Merge<T1, T2>
>;

export type FindKeyFn = {
  <T extends object>(obj: Readonly<T>): KeyOf<Readonly<T>> | undefined;

  <T extends object>(
    obj: Readonly<T>,
    predicate: (
      value: Union<ValueOf<Readonly<T>>>,
      key: Union<KeyOf<Readonly<T>>>
    ) => unknown
  ): KeyOf<Readonly<T>> | undefined;

  <T extends object, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    predicate: (
      value: Union<ResolvedValues<T, Options>>,
      key: Union<ResolvedKeys<T, Options>>
    ) => unknown,
    options: Options
  ): Type<
    | (Options['inherited'] extends true
        ? Union<ResolvedKeys<T, Options>>
        : ResolvedKeys<T, Options>)
    | undefined
  >;

  <T extends object, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: (
      value: Union<ResolvedValues<T, Options>>,
      key: Union<ResolvedKeys<T, Options>>
    ) => unknown
  ): Type<
    | (Options['inherited'] extends true
        ? Union<ResolvedKeys<T, Options>>
        : ResolvedKeys<T, Options>)
    | undefined
  >;
};

export type MapFn = {
  <T extends JsObject>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>>
  ): MappedResult<T>;

  <T extends object>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>>
  ): MappedResult<T>;

  <T extends JsObject, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>, Options>,
    options: Options
  ): MappedResult<T, Options>;

  <T extends object, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>, Options>,
    options: Options
  ): MappedResult<T, Options>;

  <T extends JsObject, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    options: Options,
    callback: MapCallback<Readonly<T>, Options>
  ): MappedResult<T, Options>;

  <T extends object, Options extends ObjectIterationOptions>(
    obj: Readonly<T>,
    options: Options,
    callback: MapCallback<Readonly<T>, Options>
  ): MappedResult<T, Options>;
};

type MapCallback<T, Options extends ObjectIterationOptions = {}> = (
  key: Union<ResolvedKeys<T, Options>>,
  value: Union<ResolvedValues<T, Options>>
) => (false | Nullish) | Multi<JsObject<unknown>> | Multi<[unknown, unknown]>;

type MappedResult<
  T,
  Options extends ObjectIterationOptions = {}
> = SimplifyDeep<ResolvedResult<T, Options> & JsObject>;

export type FilterFn = {
  <T extends JsObject>(obj: Readonly<T>): T;

  <T extends object>(obj: Readonly<T>): T;

  <T extends JsObject>(
    obj: Readonly<T>,
    predicate: FilterPredicate<Readonly<T>>
  ): FilteredResult<T>;

  <T extends object>(
    obj: Readonly<T>,
    predicate: FilterPredicate<Readonly<T>>
  ): FilteredResult<T>;

  <T extends JsObject, Options extends FilterOptions>(
    obj: Readonly<T>,
    predicate: FilterPredicate<Readonly<T>, Options>,
    options: Options
  ): FilteredResult<T, Options>;

  <T extends object, Options extends FilterOptions>(
    obj: Readonly<T>,
    predicate: FilterPredicate<Readonly<T>, Options>,
    options: Options
  ): FilteredResult<T, Options>;

  <T extends JsObject, Options extends FilterOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: FilterPredicate<Readonly<T>, Options>
  ): FilteredResult<T, Options>;

  <T extends object, Options extends FilterOptions>(
    obj: Readonly<T>,
    options: Options,
    predicate: FilterPredicate<Readonly<T>, Options>
  ): FilteredResult<T, Options>;
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

type FilteredResult<T, Options extends FilterOptions = {}> = SimplifyDeep<
  Options['withRest'] extends true
    ? [ResolvedResult<T, Options>, ResolvedResult<T, Options>]
    : ResolvedResult<T, Options>
>;

// common
type ResolvedResult<
  T,
  Options extends ObjectIterationOptions = {}
> = Options['deep'] extends true ? PartialDeep<T> : Partial<T>;

type ResolvedKeys<
  T,
  Opts extends ObjectIterationOptions = {}
> = Opts['deep'] extends true ? KeyOfDeep<Readonly<T>> : KeyOf<Readonly<T>>;

type ResolvedValues<
  T,
  Opts extends ObjectIterationOptions = {}
> = Opts['deep'] extends true ? ValueOfDeep<Readonly<T>> : ValueOf<Readonly<T>>;

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
