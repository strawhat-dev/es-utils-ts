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

export interface Extender {
  <T extends JsObject>(props: Readonly<T>): Merge<JsObject, Readonly<T>>;

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
    options: { writable?: Writable; configurable?: Configurable }
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
    options: { writable?: Writable; configurable?: Configurable }
  ): ExtendedResult<
    T1,
    Writable & Configurable extends true ? T2 : Readonly<T2>
  >;
}

export type FindKey = <T extends object>(
  obj: Readonly<T>,
  predicate?: (
    value: Union<ValueOf<Readonly<T>>>,
    key: Union<KeyOf<Readonly<T>>>
  ) => unknown
) => KeyOf<Readonly<T>> | undefined;

export interface Mapper {
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
}

export interface Filterer {
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
}

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
