/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Merge, Simplify, UnionToIntersection } from 'type-fest';
import type { Fn, JsObject } from '../type-utils.js';
import type {
  ExtendOptions,
  Extender,
  FilterFn,
  FindKeyFn,
  KeyDispatcher,
  MapCallback,
  MappedResult,
  ObjectOptions,
  PopFn,
} from './objects.types.js';

import { deepmergeInto } from '../lib/deepmerge.js';
import { isObject, nullish, nullishOrFalse } from '../conditionals/index.js';

/**
 * Retrieve an object's keys with better type support,
 * while also optionally providing a config object and/or
 * a filter callback, to decide which types of keys to include.
 */
export const keys = ((obj: JsObject, ...args: unknown[]) => {
  if (nullish(obj)) return [];
  let { opts, callback } = mapargs(args);
  const { inherited, nonEnumerable = opts['hidden'] } = opts;
  if (opts['definedOnly']) callback = (k) => !nullishOrFalse(obj[k]);
  if (inherited && nonEnumerable) return props(obj, callback);
  if (nonEnumerable) return keysOf(obj, callback);
  if (inherited) return keysIn(obj, callback);
  if (typeof callback !== 'function') return Object.keys(obj);
  return Object.keys(obj).filter(callback);
}) as KeyDispatcher;

/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **inherited**.
 */
export const keysIn = (obj: object, predicate?: Fn) => {
  const ret: string[] = [];
  if (typeof predicate !== 'function') predicate = () => true;
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
  let current = Object.getOwnPropertyNames(obj);
  do for (let i = 0; i < current.length; ++i) set.add(current[i]);
  while (
    (obj = Object.getPrototypeOf(obj)) &&
    obj !== Object.prototype &&
    (current = Object.getOwnPropertyNames(obj))
  );

  const ret = [...set];
  if (typeof predicate !== 'function') return ret;
  return ret.filter(predicate);
};

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
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  for (const [prop, value] of Object.entries(props)) {
    Object.defineProperty(target, prop, options ? mapd(prop, value, options) : { value });
  }

  return target;
}) as Extender;

/**
 * Delete all *enumeratble* properties from an object.
 * @returns the mutated cleared object
 */
export const clear = <T extends object>(obj: T): T => {
  if (nullish(obj)) return {} as T;
  for (const key of Object.keys(obj) as (keyof T)[]) delete obj[key];
  return obj;
};

/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value of the property deleted from the object
 */
export const pop: PopFn = (obj: JsObject, key = Object.keys(obj ?? {}).pop()!) => {
  if (nullish(obj)) return;
  const value = obj[key];
  delete obj[key];
  return value;
};

export const findkey: FindKeyFn = (obj: JsObject, ...args: unknown[]) => {
  const { opts, callback } = mapargs(args, { callback: (value) => !nullishOrFalse(value) });
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = (findkey as Fn)(value, opts, callback);
      if (typeof resolved !== 'undefined') return resolved;
    } else if (callback(value, key)) return key;
  }
};

export const map = <T extends object, Mapper extends MapCallback<Readonly<T>>>(
  obj: Readonly<T>,
  ...args: [Mapper] | [ObjectOptions, Mapper]
) => {
  const result: JsObject = {};
  const { opts, callback } = mapargs(args);
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key as never];
    const recurse = deep && isObject(value);
    const resolved = recurse ? [key, (map as any)(value, opts, callback)] : callback(key, value);
    if (isObject(resolved)) deepmergeInto(result, resolved);
    else if (Array.isArray(resolved)) {
      (Array.isArray(resolved[0]) ? resolved : [resolved]).forEach(
        ([k, v]) => nullishOrFalse(k) || (result[k] = v),
      );
    }
  }

  return result as Simplify<UnionToIntersection<MappedResult<Mapper>>>;
};

export const filter: FilterFn = (obj: JsObject, ...args: unknown[]) => {
  const result: JsObject = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: (entry) => !nullish(entry['value']),
  });

  (opts['withRest'] as {}) &&= {};
  type MergedOpts = Merge<typeof opts, { withRest: JsObject }>;
  const { deep, withRest, ...keyopts } = opts as MergedOpts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value })) result[key] = value;
      else if (withRest) withRest[key] = value;
    } else {
      const opts = { deep, withRest: !!withRest, ...keyopts } as const;
      const entry = filter(value, opts, callback);
      const [resolved, omitted] = withRest ? entry : [entry];
      withRest && deepmergeInto(withRest, omitted);
      result[key] = resolved;
    }
  }

  return withRest ? [result, withRest] : result;
};

const mapargs = (args: unknown[], init?: { opts?: JsObject<boolean>; callback?: Fn }) => {
  let { opts = {}, callback } = init || {};
  for (const arg of args) {
    if (!arg) continue;
    typeof arg === 'object' && (opts = arg as never);
    typeof arg === 'function' && (callback = arg as never);
  }

  return { opts, callback } as { opts: JsObject<boolean>; callback: Fn };
};

const mapd = (
  property: string,
  value: unknown,
  options: ExtendOptions,
  resolve = (d: unknown) => (Array.isArray(d) ? d.includes(property) : !!d),
): PropertyDescriptor => ({
  value,
  writable: resolve(options.writable),
  enumerable: resolve(options.enumerable),
  configurable: resolve(options.configurable),
});
