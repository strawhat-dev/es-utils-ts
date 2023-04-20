import type { Merge } from 'type-fest';
import type { JsObject, KeyOf, Maybe } from '@/types';
import type {
  FilterArgs,
  FilterFn,
  FilteredResult,
  FindKeyFn,
  MapArgs,
  MapFn,
  MappedResult,
} from '@/objects/types';

import { deepmerge } from 'deepmerge-ts';
import { isobject, isprimitive, not } from '@/conditionals';

export const clear = (obj: object) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
};

export const deepcopy = <T extends object>(
  obj: T,
  hashmap = new WeakMap()
): T => {
  if (hashmap.has(obj)) return hashmap.get(obj); // circular reference
  const target = Array.isArray(obj) ? [] : {};
  hashmap.set(obj, target);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = isprimitive(value) ? value : deepcopy(value, hashmap);
    return acc;
  }, target) as T;
};

/* eslint-disable @typescript-eslint/ban-types */
export const extend = <
  T1 extends object,
  T2 extends JsObject,
  Writable extends boolean,
  Configurable extends boolean
>(
  target: T1,
  props?: Readonly<T2>,
  options?: { writable?: Writable; configurable?: Configurable }
) => {
  type Props = Writable & Configurable extends true ? T2 : Readonly<T2>;
  if (!props) [target, props] = [{} as T1, target as unknown as T2];
  return Object.defineProperties(
    target,
    Object.entries(props).reduce((acc, [prop, value]) => {
      acc[prop] = { ...options, value };
      return acc;
    }, {})
  ) as T1 extends Function ? T1 & Props : Merge<T1, Props>;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const findkey = <T extends object>(
  obj: T,
  predicate: FindKeyFn<T> = (value) => !not(value)
) => {
  return Object.keys(obj || {}).find((k) =>
    predicate!(obj[k], k as never)
  ) as Maybe<KeyOf<T>>;
};

export const map = <T extends JsObject, Deep extends boolean>(
  obj: T,
  ...args: MapArgs<T, Deep>
) => {
  let [mapper, opts = { deep: false }] = args as [MapFn<T, Deep>];
  if (isobject(mapper) || typeof opts === 'function') {
    [mapper, opts] = [opts as never, mapper as never];
  }

  const { deep } = { ...opts };
  const result = Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const entry = (
      deep && isobject(value)
        ? [key, map(value, { deep }, mapper as never)]
        : mapper(key as never, value as never)
    ) as unknown;

    if (!entry) return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (isobject(entries[0])) return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => not(k) || (acc[k] = v)
    );

    return acc;
  }, {});

  return result as MappedResult<T, Deep>;
};

export const filter = <
  T extends JsObject,
  Deep extends boolean,
  WithRest extends boolean
>(
  obj: T,
  ...args: FilterArgs<T, Deep, WithRest>
) => {
  let [
    predicate = ({ value }) => typeof value !== 'undefined',
    opts = { deep: !args.length, withRest: false },
  ] = args as [FilterFn<T, Deep>];

  if (isobject(predicate) || typeof opts === 'function') {
    [predicate, opts] = [opts as never, predicate as never];
  }

  const { deep, withRest } = { ...opts };
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isobject(value)) {
        value = filter(value, { deep }, predicate as never);
      }

      (predicate({ key, value } as never) ? acc : omit)[key] = value;
      return [acc, omit];
    },
    [{}, {}]
  );

  return (withRest ? [filtered, rest] : filtered) as FilteredResult<
    T,
    Deep,
    WithRest
  >;
};
