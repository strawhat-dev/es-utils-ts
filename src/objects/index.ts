/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JsObject } from '@/types';
import type { Extender, Filterer, FindKey, Mapper } from '@/objects/types';

import { deepmergeInto } from '@/externals';
import { is, isObject, not } from '@/conditionals';

export const clear = (obj: object) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
};

export const extend: Extender = (...args: unknown[]) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  return Object.defineProperties(
    target,
    Object.entries(props as never).reduce(
      (acc, [prop, value]) => ((acc[prop] = { ...options!, value }), acc),
      {}
    )
  ) as never;
};

export const findkey: FindKey = (obj, predicate = (value) => !not(value)) => {
  return Object.keys(obj || {}).find((key) =>
    predicate(obj[key], key as never)
  ) as never;
};

export const map: Mapper = (obj: object, ...args: unknown[]) => {
  const callback = args.pop() as (...args: unknown[]) => unknown;
  const { deep } = { ...(args.pop() as { deep?: boolean }) };
  return Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const result = (
      deep && isObject(value)
        ? [key, map(value, { deep }, callback as never)]
        : callback(key, value)
    ) as unknown;

    if (!is(result).anyOf('Array', 'Object')) return acc;

    const entries = (
      Array.isArray(result) && typeof result[0] === 'object' ? result : [result]
    ) as (JsObject | [unknown, unknown])[];

    entries.forEach((entry) =>
      (Array.isArray(entry) ? assignEntry : deepmergeInto)(acc, entry)
    );

    return acc;
  }, {});
};

export const filter: Filterer = (obj: object, ...args: unknown[]) => {
  const defaults = {
    opts: { deep: !args.length, withRest: false },
    predicate: ({ value }: never) => typeof value !== 'undefined',
  };

  const { opts, predicate } = args.reduce<typeof defaults>((acc, arg) => {
    if (isObject(arg)) acc.opts = arg as never;
    else if (typeof arg === 'function') acc.predicate = arg as never;
    return acc;
  }, defaults);

  const { deep, withRest } = opts;
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isObject(value)) {
        const [resolved, omitted] = filter(
          value,
          { deep, withRest: true },
          predicate as never
        );

        acc[key] = resolved;
        Object.keys(omitted).length && (omit[key] = omitted);
      } else {
        (predicate({ key, value } as never) ? acc : omit)[key] = value;
      }

      return [acc, omit];
    },
    [{}, {}]
  );

  return withRest ? [filtered, rest] : filtered;
};

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assignEntry = (obj: object, [k, v]: any) => not(k) || (obj[k] = v);
