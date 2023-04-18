import type { Merge } from 'type-fest';
import type { JsObject, KeyOf, Maybe, Type } from '@/types';
import type {
  ExtendedObject,
  FilterArgs,
  FilteredResult,
  FindKeyFn,
  MapArgs,
  MapFn,
  MappedResult,
} from '@/objects/types';

import { deepmerge } from 'deepmerge-ts';
import { isobject, isprimitive, nullishFalse } from '@/conditionals';

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
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = isprimitive(v) ? v : deepcopy(v, hashmap);
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
export const findkey = <T extends object>(obj: T, predicate?: FindKeyFn<T>) => {
  predicate ||= (value) => !nullishFalse(value);
  return Object.keys(obj || {}).find((k) =>
    predicate!(obj[k], k as never)
  ) as Maybe<KeyOf<T>>;
};

export const map = <
  Result extends JsObject,
  T = object,
  WithChainedMethods extends boolean = true
>(
  obj: T,
  ...args: MapArgs<T, WithChainedMethods>
) => {
  let [mapper, opts = { deep: false, chainMethods: true }] = args as [MapFn<T>];
  if (typeof opts === 'function') {
    [mapper, opts] = [opts, mapper as typeof opts];
  }

  const { deep, chainMethods } = opts;
  const result = Object.entries(obj || {}).reduce((acc, [key, val]) => {
    const entry = (
      deep && isobject(val)
        ? [key, map(val as T, { deep, chainMethods: false }, mapper)]
        : mapper(key as never, val as never)
    ) as unknown;

    if (!entry) return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (isobject(entries[0])) return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => nullishFalse(k) || (acc[k] = v)
    );

    return acc;
  }, {});

  return (chainMethods ? extended(result) : result) as Type<
    T extends Result ? MappedResult<T, WithChainedMethods> : Result
  >;
};

export const filter = <
  Result extends JsObject,
  T = object,
  WithRest extends boolean = false,
  WithChainedMethods extends boolean = true
>(
  obj: T,
  ...args: FilterArgs<T, WithRest, WithChainedMethods>
) => {
  const defaultOpts = {
    deep: !args.length,
    withRest: false,
    chainMethods: true,
  };

  let [
    opts = defaultOpts,
    predicate = ({ value }) => typeof value !== 'undefined',
  ] = args;

  if (typeof opts === 'function') {
    [opts, predicate] = [defaultOpts, opts];
  }

  const { deep, withRest, chainMethods } = opts;
  let [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isobject(value)) {
        value = filter(value as T, { deep, chainMethods: false }, predicate);
      }

      (predicate({ key, value } as never) ? acc : omit)[key] = value;
      return [acc, omit];
    },
    [{}, {}]
  );

  chainMethods && ([filtered, rest] = [extended(filtered), extended(rest)]);
  return (withRest ? [filtered, rest] : filtered) as Type<
    T extends Result ? FilteredResult<T, WithRest, WithChainedMethods> : Result
  >;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/** @internal */
const extended = <T extends object>(obj: T) => {
  const $MAP = (...args: never) => map(obj, ...args);
  const $FILTER = (...args: never) => filter(obj, ...args);
  const $FINDKEY: any = (predicate: never) => findkey(obj, predicate);
  return extend(
    obj,
    [$MAP, $FILTER, $FINDKEY].reduce((acc, fn) => {
      const { name } = fn;
      const prop = name.slice(1).toLowerCase();
      if (
        !Object.hasOwn(obj, prop) ||
        (typeof obj[prop] === 'function' && obj[prop].name === name)
      ) {
        acc[prop] = fn;
      }

      return acc;
    }, {}),
    { configurable: true, writable: true }
  ) as ExtendedObject<T>;
};
