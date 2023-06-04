/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Fn, JsObject, Merge } from '../type-utils.js';
import type {
  ClearFn,
  ExtendOptions,
  Extender,
  Filterer,
  FindKeyFn,
  KeyDispatcher,
  Mapper,
  PopFn,
} from './types.js';

import { deepcopy, deepmergeInto } from '../externals.js';
import { isObject, nullish } from '../conditionals/index.js';

/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **inherited**.
 */
export const keysIn = (obj: object, predicate?: Fn) => {
  const ret: string[] = [];
  if (typeof predicate !== 'function') return ret;
  for (const key in obj) predicate(key) && ret.push(key);
  return ret;
};

/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **non-enumerable**.
 */
export const keysOf = (obj: object, predicate?: Fn) => {
  const ret = Object.getOwnPropertyNames(obj);
  if (typeof predicate !== 'function') return ret;
  return ret.filter(predicate);
};

/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **inherited** + **non-enumerable**.
 */
export const props = (obj: object, predicate?: Fn) => {
  const set = new Set();
  let current = keysOf(obj, predicate);
  do for (let i = 0; i < current.length; ++i) set.add(current[i]);
  while (
    (obj = Object.getPrototypeOf(obj)) &&
    obj !== Object.prototype &&
    (current = keysOf(obj, predicate))
  );

  return [...set];
};

/**
 * Retrieve an object's keys with better type support,
 * while also optionally providing a config object and/or
 * a filter callback, to decide which types of keys to include.
 */
export const keys = ((obj: JsObject, ...args: unknown[]) => {
  if (nullish(obj)) return [];
  let { opts, callback } = mapargs(args);
  const { inherited, nonEnumerable } = opts;
  if (opts['definedOnly']) callback = (k) => !(nullish(obj[k]) || obj[k] === false);
  if (inherited && nonEnumerable) return props(obj, callback);
  if (nonEnumerable) return keysOf(obj, callback);
  if (inherited) return keysIn(obj, callback);
  if (typeof callback !== 'function') return Object.keys(obj);
  return Object.keys(obj).filter(callback);
}) as KeyDispatcher;

/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided last,
 * and the extended result will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
export const extend = ((...args: any[]) => {
  const [target, obj, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...config } = options ?? {};
  const ret = copy ? deepcopy(target) : target;
  for (const p in obj) Object.defineProperty(ret, p, mapd(p, obj[p], config));
  return freeze ? Object.freeze(ret) : ret;
}) as Extender;

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
 * @returns the value of the property deleted from the object
 */
export const pop: PopFn = (obj: JsObject, key = Object.keys(obj ?? {}).pop()) => {
  if (nullish(obj)) return;
  const value = obj[key!];
  delete obj[key!];
  return value;
};

export const findkey: FindKeyFn = (obj: JsObject, ...args: unknown[]) => {
  const { opts, callback } = mapargs(args, { callback: (k) => k });
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = (findkey as Fn)(value, opts, callback!);
      if (resolved) return resolved;
    } else if (callback?.(value, key)) return key;
  }
};

export const map: Mapper = (obj: JsObject, ...args: unknown[]) => {
  const result: JsObject = {};
  const { opts, callback } = mapargs(args);
  const { deep, freeze, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    let entry;
    const value = obj[key];
    if (deep && isObject(value)) entry = [key, (map as Fn)(value, opts, callback!)];
    else entry = callback?.(key, value);
    if (isObject(entry)) deepmergeInto(result, entry);
    else if (Array.isArray(entry)) {
      if (!Array.isArray(entry[0])) result[entry[0]] = entry[1];
      else entry.forEach(([k, v]) => (result[k] = v));
    }
  }

  return freeze ? Object.freeze(result) : result;
};

export const filter: Filterer = (obj: JsObject, ...args: unknown[]) => {
  const result: JsObject = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: (entry) => !nullish(entry['value']),
  });

  (opts['withRest'] as {}) &&= {};
  type MergedOpts = Merge<typeof opts, { withRest: JsObject }>;
  const { deep, freeze, withRest, ...keyopts } = opts as MergedOpts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback?.({ key, value })) result[key] = value;
      else if (withRest) withRest[key] = value;
    } else {
      const opts = { deep, freeze, withRest: !!withRest, ...keyopts } as const;
      const entry = filter(value, opts, callback!);
      const [resolved, omitted] = withRest ? entry : [entry, {}];
      Object.keys(omitted).length && (withRest[key] = omitted);
      result[key] = resolved;
    }
  }

  freeze && Object.freeze(result);
  return withRest ? [result, withRest] : result;
};

const mapargs = (args: unknown[], init?: { opts?: JsObject<boolean>; callback?: Fn }) => {
  const initopts = init?.opts ?? {};
  let [callback = init?.callback, opts = initopts] = args;
  if (typeof opts === 'function' || typeof callback === 'object') {
    [callback = init?.callback, opts = initopts] = [opts, callback];
  }

  return { opts, callback } as { opts: JsObject<boolean>; callback?: Fn };
};

const mapd = (
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
