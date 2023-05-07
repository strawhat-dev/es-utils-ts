/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsObject, KeyOf } from '@/types';
import type {
  ClearFn,
  ExtendFn,
  ExtendOptions,
  FilterFn,
  FindKeyFn,
  MapFn,
  PopFn,
  PropsFn,
} from './types';

import { isObject, not, nullish } from '@/conditionals';
import { deepcopy, deepmergeInto } from '@/externals';

/**
 * @returns an array of the object's keys, including *inherited* ones
 */
export const keysIn = <T extends object>(obj: T) => {
  const result = [];
  for (const key in obj) result.push(key);
  return result;
};

/**
 * @returns an array of **all** of the object's properties, including those that are *inherited* and *non-enumerable*
 */
export const props: PropsFn = (obj, options = {}) => {
  const traverse = (
    options.objectPrototype
      ? Object.getPrototypeOf
      : (obj) => {
          const proto = Object.getPrototypeOf(obj);
          if (proto !== Object.prototype) return proto;
        }
  ) as typeof Object.getPrototypeOf;

  const result = new Set();
  do for (const prop of Object.getOwnPropertyNames(obj)) result.add(prop);
  while ((obj = traverse(obj)));
  return [...result] as never;
};

/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value deleted from the object
 */
export const pop: PopFn = (
  obj: JsObject,
  key = Object.keys(obj ?? {}).pop()
) => {
  if (nullish(obj)) return;
  const value = obj[key!];
  delete obj[key!];
  return value;
};

/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
export const clear: ClearFn = (obj, options) => {
  if (nullish(obj)) return {};
  const keys = keysDispatch(options);
  for (const key of keys(obj)) delete (obj as JsObject)[key];
  return obj;
};

/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be provided as the third argument,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 *
 * Note: This would apply to all of the given properties however,
 * as opposed to a per-property basis with `Object.defineProperties`.
 */
export const extend: ExtendFn = (...args: unknown[]) => {
  const descriptorMap: PropertyDescriptorMap = {};
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, ...descriptors } = { ...(options as ExtendOptions) };
  for (const key in props!) {
    descriptorMap[key] = { ...descriptors, value: (props as JsObject)[key] };
  }

  return Object.defineProperties(
    copy ? deepcopy(target) : target,
    descriptorMap
  ) as object;
};

export const findkey: FindKeyFn = (obj: JsObject, ...args: unknown[]) => {
  const { opts, callback } = parseRestArgs(args, {
    callback: (value: unknown) => !not(value),
  });

  const { deep, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, { deep, keys }, callback as never);
      if (resolved) return resolved;
    } else if (callback(value, key)) return key;
  }
};

// prettier-ignore
export const map: MapFn = (obj: JsObject, ...args: unknown[]) => {
  const result = {};
  const { opts, callback } = parseRestArgs(args);
  const { deep, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    const entry = (
      deep && isObject(value)
        ? [key, map(value, { deep, keys }, callback as never)]
        : callback(key, value)
    );

    const entries = (
      Array.isArray(entry) && typeof entry[0] === 'object' ? entry : [entry]
    );

    entries.forEach((entry) =>
      (isObject(entry) ? deepmergeInto : assignEntry)(result, entry)
    );
  }

  return result;
};

export const filter: FilterFn = (obj: JsObject, ...args: unknown[]) => {
  const result: JsObject = {};
  const { opts, callback } = parseRestArgs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: ({ value }: { value: unknown }) => typeof value !== 'undefined',
  });

  (opts['withRest'] as {}) &&= {};
  const { deep, withRest, ...keyopts } = opts as unknown as {
    deep: boolean;
    withRest: JsObject;
  };

  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value })) result[key] = value;
      else if (withRest) withRest[key] = value;
    } else {
      const entry = filter(
        value,
        { deep, keys, withRest: !!withRest },
        callback as never
      );

      const [resolved, omitted] = withRest ? entry : [entry, {}];
      if (Object.keys(omitted).length) withRest[key] = omitted;
      result[key] = resolved;
    }
  }

  return withRest ? [result, withRest] : result;
};

export const object = Object.freeze({
  clear,
  extend,
  filter,
  findkey,
  keysIn,
  map,
  pop,
  props,
} as const);

/** @internal */
// prettier-ignore
const assignEntry = (obj: JsObject<unknown>, entry: [string, unknown]) => not(entry?.[0]) || (obj[entry[0]] = entry[1]);

/** @internal */
const parseRestArgs = (
  args: unknown[],
  init: { opts?: JsObject<boolean>; callback?: Function } = {}
) => {
  for (const arg of args) {
    if (isObject(arg)) init.opts = arg;
    else if (typeof arg === 'function') init.callback = arg;
  }

  init.opts ||= {};
  init.callback ||= () => {};
  return init as Required<typeof init>;
};

/** @internal */
const keysDispatch = ((opts) => {
  if (!opts) return Object.keys;

  if (opts['keys']) return opts['keys'];

  if (opts['nonEnumerable']) {
    if (opts['inherited']) return props;
    return Object.getOwnPropertyNames;
  }

  if (opts['inherited']) return keysIn;

  return Object.keys;
}) as (opts?: JsObject<boolean>) => <T>(obj: T) => KeyOf<T>;
