/* eslint-disable @typescript-eslint/ban-types */
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

export type ClearFn = <T extends object>(obj: Readonly<T>) => Partial<T>;

export type PopFn = {
  <T extends JsObject, Key extends KeyOf<T>>(
    obj: Readonly<T>,
    key: Key
  ): T[Key];

  <T extends object, Key extends keyof T>(obj: Readonly<T>, key: Key): T[Key];
};

export type FindKeyFn = <T extends object>(
  obj: Readonly<T>,
  predicate?: (
    value: Union<ValueOf<Readonly<T>>>,
    key: Union<KeyOf<Readonly<T>>>
  ) => unknown
) => KeyOf<Readonly<T>> | undefined;

export type MapFn = {
  <T extends JsObject>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>>
  ): MappedResult<T>;

  <T extends object>(
    obj: Readonly<T>,
    callback: MapCallback<Readonly<T>>
  ): MappedResult<T>;

  <T extends JsObject, Deep extends boolean = false>(
    obj: Readonly<T>,
    options: { deep?: Deep },
    callback: MapCallback<Readonly<T>, Deep>
  ): MappedResult<T, Deep>;

  <T extends object, Deep extends boolean = false>(
    obj: Readonly<T>,
    options: { deep?: Deep },
    callback: MapCallback<Readonly<T>, Deep>
  ): MappedResult<T, Deep>;
};

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

  <
    T extends JsObject,
    Deep extends boolean = false,
    WithRest extends boolean = false
  >(
    obj: Readonly<T>,
    options: { deep?: Deep; withRest?: WithRest },
    predicate: FilterPredicate<Readonly<T>, Deep>
  ): FilteredResult<T, Deep, WithRest>;

  <
    T extends object,
    Deep extends boolean = false,
    WithRest extends boolean = false
  >(
    obj: Readonly<T>,
    options: { deep?: Deep; withRest?: WithRest },
    predicate: FilterPredicate<Readonly<T>, Deep>
  ): FilteredResult<T, Deep, WithRest>;
};

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

  <
    T1 extends JsObject,
    T2 extends JsObject,
    Writable extends boolean = false,
    Configurable extends boolean = false
  >(
    obj: Readonly<T1>,
    props: Readonly<T2>,
    options: PropertyOptions<Writable, Configurable>
  ): ExtendedResult<
    T1,
    Writable & Configurable extends true ? T2 : Readonly<T2>
  >;

  <
    T1 extends object,
    T2 extends JsObject,
    Writable extends boolean = false,
    Configurable extends boolean = false
  >(
    obj: Readonly<T1>,
    props: Readonly<T2>,
    options: PropertyOptions<Writable, Configurable>
  ): ExtendedResult<
    T1,
    Writable & Configurable extends true ? T2 : Readonly<T2>
  >;
};

// private
type ExtendedResult<T1, T2> = Type<
  T1 extends Function ? T1 & Simplify<T2> : Merge<T1, T2>
>;

type MappedResult<T, Deep = false> = SimplifyDeep<
  (Deep extends true ? PartialDeep<T> : Partial<T>) & JsObject
>;

type FilteredResult<T, Deep = false, WithRest = false> = Type<
  WithRest extends true
    ? [MappedResult<T, Deep>, MappedResult<T, Deep>]
    : MappedResult<T, Deep>
>;

type MapCallback<T, Deep = false> = (
  key: Union<Deep extends true ? KeyOfDeep<T> : KeyOf<T>>,
  value: Union<Deep extends true ? ValueOfDeep<T> : ValueOf<T>>
) => (false | Nullish) | Multi<JsObject> | Multi<[unknown, unknown]>;

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
