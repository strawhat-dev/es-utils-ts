import { deepmergeInto } from './chunk-2EVM2WRW.js';
import { nullish, isObject, nullishOrFalse } from './chunk-WEJR7A5E.js';

// src/objects/index.ts
var keys = (obj, ...args) => {
  if (nullish(obj))
    return [];
  let { opts, callback } = mapargs(args);
  const { inherited, nonEnumerable = opts["hidden"] } = opts;
  if (opts["definedOnly"])
    callback = (k) => !nullishOrFalse(obj[k]);
  if (inherited && nonEnumerable)
    return props(obj, callback);
  if (nonEnumerable)
    return keysOf(obj, callback);
  if (inherited)
    return keysIn(obj, callback);
  if (typeof callback !== "function")
    return Object.keys(obj);
  return Object.keys(obj).filter(callback);
};
var keysIn = (obj, predicate) => {
  const ret = [];
  if (typeof predicate !== "function")
    predicate = () => true;
  for (const key in obj)
    predicate(key) && ret.push(key);
  return ret;
};
var keysOf = (obj, predicate) => {
  const ret = Object.getOwnPropertyNames(obj);
  if (typeof predicate !== "function")
    return ret;
  return ret.filter(predicate);
};
var props = (obj, predicate) => {
  const set = /* @__PURE__ */ new Set();
  let current = Object.getOwnPropertyNames(obj);
  do
    for (let i = 0; i < current.length; ++i)
      set.add(current[i]);
  while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype && (current = Object.getOwnPropertyNames(obj)));
  const ret = [...set];
  if (typeof predicate !== "function")
    return ret;
  return ret.filter(predicate);
};
var extend = (...args) => {
  const [target, props2, options] = args.length === 1 ? [{}, args.pop()] : args;
  for (const [prop, value] of Object.entries(props2)) {
    Object.defineProperty(target, prop, options ? mapd(prop, value, options) : { value });
  }
  return target;
};
var clear = (obj) => {
  if (nullish(obj))
    return {};
  for (const key of Object.keys(obj))
    delete obj[key];
  return obj;
};
var pop = (obj, key = Object.keys(obj ?? {}).pop()) => {
  if (nullish(obj))
    return;
  const value = obj[key];
  delete obj[key];
  return value;
};
var findkey = (obj, ...args) => {
  const { opts, callback } = mapargs(args, { callback: (value) => !nullishOrFalse(value) });
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, opts, callback);
      if (typeof resolved !== "undefined")
        return resolved;
    } else if (callback(value, key))
      return key;
  }
};
var map = (obj, ...args) => {
  const result = {};
  const { opts, callback } = mapargs(args);
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    const recurse = deep && isObject(value);
    const resolved = recurse ? [key, map(value, opts, callback)] : callback(key, value);
    if (isObject(resolved))
      deepmergeInto(result, resolved);
    else if (Array.isArray(resolved)) {
      (Array.isArray(resolved[0]) ? resolved : [resolved]).forEach(
        ([k, v]) => nullishOrFalse(k) || (result[k] = v)
      );
    }
  }
  return result;
};
var filter = (obj, ...args) => {
  const result = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: (entry) => !nullish(entry["value"])
  });
  opts["withRest"] &&= {};
  const { deep, withRest, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value }))
        result[key] = value;
      else if (withRest)
        withRest[key] = value;
    } else {
      const opts2 = { deep, withRest: !!withRest, ...keyopts };
      const entry = filter(value, opts2, callback);
      const [resolved, omitted] = withRest ? entry : [entry];
      withRest && deepmergeInto(withRest, omitted);
      result[key] = resolved;
    }
  }
  return withRest ? [result, withRest] : result;
};
var mapargs = (args, init) => {
  let { opts = {}, callback } = init || {};
  for (const arg of args) {
    if (!arg)
      continue;
    typeof arg === "object" && (opts = arg);
    typeof arg === "function" && (callback = arg);
  }
  return { opts, callback };
};
var mapd = (property, value, options, resolve = (d) => Array.isArray(d) ? d.includes(property) : !!d) => ({
  value,
  writable: resolve(options.writable),
  enumerable: resolve(options.enumerable),
  configurable: resolve(options.configurable)
});

export { clear, extend, filter, findkey, keys, keysIn, keysOf, map, pop, props };
