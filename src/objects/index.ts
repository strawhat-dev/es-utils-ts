/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsObject, KeyOf, Merge, Union } from '../types';
import type {
  ClearFn,
  ExtendFn,
  ExtendOptions,
  FilterFn,
  FindKeyFn,
  KeyDispatcher,
  MapFn,
  PopFn,
} from './types';

import { deepcopy, deepmergeInto } from '../externals';
import { isObject, not, nullish } from '../conditionals';

export const keys = ((obj, options) => {
  if (nullish(obj)) return [];
  const { inherited, nonEnumerable } = options ?? {};
  if (inherited && nonEnumerable) return props(obj);
  if (nonEnumerable) return Object.getOwnPropertyNames(obj);
  if (inherited) return keysIn(obj);
  return Object.keys(obj);
}) as KeyDispatcher;

/**
 * Keys including those that are **inherited**.
 * @internal for {@link keys}
 */
export const keysIn = <T extends object>(obj: T) => {
  const ret = [];
  for (const key in obj) ret.push(key);
  return ret;
};

/**
 * Keys including those that are **inherited** and **non-enumerable**.
 * @internal for {@link keys}
 */
export const props = <T extends object>(obj: T) => {
  const ret = new Set();
  do for (const prop of Object.getOwnPropertyNames(obj)) ret.add(prop);
  while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype);
  return [...ret] as Union<KeyOf<T>>;
};

/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
export const clear: ClearFn = (obj, options) => {
  if (nullish(obj)) return {};
  for (const key of keys(obj, options)) delete obj[key];
  return obj;
};

/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value deleted from the object
 */
export const pop: PopFn = (obj: JsObject, key = keys(obj).pop()) => {
  if (nullish(obj)) return;
  const value = obj[key!];
  delete obj[key!];
  return value;
};

/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
export const extend = ((...args: any[]) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...descriptors } = options ?? {};
  const ret = copy ? deepcopy(target) : target;
  for (const key in props) {
    Object.defineProperty(
      ret,
      key,
      mapDescriptors(key, props[key], descriptors)
    );
  }

  return freeze ? Object.freeze(ret) : ret;
}) as ExtendFn;

export const findkey: FindKeyFn = (obj: JsObject, ...args: unknown[]) => {
  const { opts, callback } = mapargs(args, {
    callback: (value: unknown) => !not(value),
  });

  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, opts, callback);
      if (resolved) return resolved;
    } else if (callback(value, key)) return key;
  }
};

export const map: MapFn = (obj: JsObject, ...args: unknown[]) => {
  const result: JsObject = {};
  const { opts, callback } = mapargs(args);
  const { deep, freeze, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    const entry = (
      deep && isObject(value)
        ? [key, map(value, opts, callback)]
        : callback(key, value)
    ) as object;

    if (isObject(entry)) deepmergeInto(result, entry);
    else if (Array.isArray(entry)) {
      (Array.isArray(entry[0]) ? entry : [entry]).forEach(
        ([k, v]) => (result[k] = v)
      );
    }
  }

  return freeze ? Object.freeze(result) : result;
};

export const filter: FilterFn = (obj: JsObject, ...args: unknown[]) => {
  let result: JsObject = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: ({ value }: { value: unknown }) => typeof value !== 'undefined',
  });

  (opts['withRest'] as {}) &&= {};
  type MergedOpts = Merge<typeof opts, { withRest: JsObject }>;
  const { deep, freeze, withRest, ...keyopts } = opts as MergedOpts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value })) result[key] = value;
      else if (withRest) withRest[key] = value;
    } else {
      const opts = { deep, freeze, withRest: !!withRest, ...keyopts } as const;
      const entry = filter(value, opts, callback);
      const [resolved, omitted] = withRest ? entry : [entry, {}];
      Object.keys(omitted).length && (withRest[key] = omitted);
      result[key] = resolved;
    }
  }

  freeze && (result = Object.freeze(result));
  return withRest ? [result, withRest] : result;
};

export const _ = Object.freeze({
  clear,
  extend,
  filter,
  findkey,
  keys,
  keysIn,
  map,
  pop,
  props,
});

/** @internal */
const mapargs = (
  args: unknown[],
  init: { opts?: JsObject<boolean>; callback?: Function } = {}
) => {
  for (const arg of args) {
    if (typeof arg === 'function') init.callback = arg;
    else if (typeof arg === 'object') init.opts = arg as {};
  }

  init.opts ||= {};
  init.callback ||= () => {};
  return init as Required<typeof init>;
};

/** @internal */
const mapDescriptors = (
  property: string,
  value: unknown,
  options: ExtendOptions,
  resolver = (d: unknown) => (Array.isArray(d) ? d.includes(property) : !!d)
): PropertyDescriptor => ({
  value,
  writable: resolver(options.writable),
  enumerable: resolver(options.enumerable),
  configurable: resolver(options.configurable),
});
