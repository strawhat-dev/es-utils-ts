/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Extender, Filterer, FindKey, Mapper } from '@/objects/types';

import { deepmerge } from 'deepmerge-ts';
import { assert, not } from '@/assertions';

export const clear = (obj: object) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
};

export const deepcopy = <T extends object>(obj: T, hash = new WeakMap()): T => {
  if (hash.has(obj)) return hash.get(obj); // circular reference
  const target = Array.isArray(obj) ? [] : {};
  hash.set(obj, target);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = assert.isPrimitive(value) ? value : deepcopy(value, hash);
    return acc;
  }, target) as T;
};

export const findkey = ((obj, predicate = (value) => !not(value)) => {
  return Object.keys(obj || {}).find((k) => predicate(obj[k], k as never));
}) as FindKey;

export const extend = ((...args: unknown[]) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  return Object.defineProperties(
    target,
    Object.entries(props as never).reduce((acc, [prop, value]) => {
      acc[prop] = { ...options!, value };
      return acc;
    }, {})
  );
}) as Extender;

export const map: Mapper = (obj: object, ...args: unknown[]) => {
  const callback = args.pop() as (...args: unknown[]) => unknown;
  const { deep } = { ...(args.pop() as { deep?: boolean }) };
  return Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const entry = (
      deep && assert.isObject(value)
        ? [key, map(value, { deep }, callback as never)]
        : callback(key, value)
    ) as unknown;

    if (!entry) return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (assert.isObject(entries[0])) return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => not(k) || (acc[k] = v)
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
    if (assert.isObject(arg)) acc.opts = arg as never;
    else if (typeof arg === 'function') acc.predicate = arg as never;
    return acc;
  }, defaults);

  const { deep, withRest } = opts;
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      (predicate({ key, value } as never) ? acc : omit)[key] =
        deep && assert.isObject(value)
          ? filter(value, { deep }, predicate as never)
          : value;

      return [acc, omit];
    },
    [{}, {}]
  );

  return withRest ? [filtered, rest] : filtered;
};
