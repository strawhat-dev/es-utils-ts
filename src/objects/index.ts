/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsObject } from '@/types';
import type { Extender, Filterer, FindKey, Mapper } from './types.js';

import { deepmergeInto } from '@/externals';
import { isObject, not } from '@/conditionals';

/**
 * Convenience wrapper for `Object.defineProperties` with better type support. Instead of
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
export const extend: Extender = (...args: unknown[]) => {
  const descriptorMap = {};
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  for (const key of Object.keys(props!)) {
    descriptorMap[key] = { ...options!, value: props![key] };
  }

  return Object.defineProperties(target, descriptorMap) as never;
};

export const clear = (obj: object) => {
  for (const key of Object.keys(obj)) delete obj[key];
  return obj;
};

export const findkey: FindKey = (obj, predicate = (value) => !not(value)) => {
  for (const key of Object.keys(obj || {})) {
    if (predicate(obj[key], key as never)) return key as never;
  }
};

export const map: Mapper = (obj: object, ...args: unknown[]) => {
  const result = {};
  const callback = args.pop() as (...args: unknown[]) => unknown;
  const { deep } = { ...(args.pop() as { deep?: boolean }) };
  for (const key of Object.keys(obj || {})) {
    const value = obj[key];
    const entry = (
      deep && isObject(value)
        ? [key, map(value, { deep }, callback as never)]
        : callback(key, value)
    ) as unknown;

    const entries = (
      Array.isArray(entry) && typeof entry[0] === 'object' ? entry : [entry]
    ) as (JsObject | [unknown, unknown])[];

    entries.forEach((entry) =>
      (isObject(entry) ? deepmergeInto : assignEntry)(result, entry)
    );
  }

  return result;
};

export const filter: Filterer = (obj: object, ...args: unknown[]) => {
  const defaults = {
    opts: { deep: !args.length, withRest: false as boolean | JsObject },
    predicate: ({ value }: never) => typeof value !== 'undefined',
  };

  const { opts, predicate } = args.reduce<typeof defaults>((acc, arg) => {
    if (isObject(arg)) acc.opts = arg as never;
    else if (typeof arg === 'function') acc.predicate = arg as never;
    return acc;
  }, defaults);

  const result = {};
  opts.withRest &&= {};
  const { deep, withRest } = opts;
  for (const key of Object.keys(obj || {})) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (predicate({ key, value } as never)) result[key] = value;
      else if (withRest) withRest[key] = value;
    } else {
      const entry = filter(
        value,
        { deep, withRest: !!withRest },
        predicate as never
      ) as never;

      const [resolved, omitted] = withRest ? entry : [entry, {}];
      if (Object.keys(omitted).length) withRest[key] = omitted;
      result[key] = resolved;
    }
  }

  return withRest ? [result, withRest] : result;
};

/** @internal */
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assignEntry = (obj: object, entry: any) => not(entry?.[0]) || (obj[entry[0]] = entry[1]);
