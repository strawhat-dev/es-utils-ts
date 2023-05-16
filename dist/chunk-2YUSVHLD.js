import { nullish, isObject } from './chunk-R2HOTKJN.js';
import { __name, deepcopy, deepmergeInto } from './chunk-ETHVEPTR.js';

// src/objects/index.ts
var keysIn = /* @__PURE__ */ __name((obj, f) => {
  const ret = [];
  for (const key in obj) {
    let include = true;
    if (typeof f === "function")
      include = f(key);
    include && ret.push(key);
  }
  return ret;
}, "keysIn");
var keysOf = /* @__PURE__ */ __name((obj, f) => {
  const result = Object.getOwnPropertyNames(obj);
  if (!f)
    return result;
  const ret = [];
  for (let i = 0; i < result.length; ++i) {
    const key = result[i];
    let include = true;
    if (typeof f === "function")
      include = f(key);
    include && ret.push(key);
  }
  return ret;
}, "keysOf");
var props = /* @__PURE__ */ __name((obj, f) => {
  const set = /* @__PURE__ */ new Set();
  let current = keysOf(obj, f);
  do
    for (let i = 0; i < current.length; ++i)
      set.add(current[i]);
  while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype && (current = keysOf(obj, f)));
  return [...set];
}, "props");
var keys = /* @__PURE__ */ __name((obj, ...args) => {
  if (nullish(obj))
    return [];
  let { opts, callback } = mapargs(args);
  const { inherited, nonEnumerable } = opts;
  if (opts["defined"])
    callback = /* @__PURE__ */ __name((k) => !(nullish(obj[k]) || obj[k] === false), "callback");
  if (inherited && nonEnumerable)
    return props(obj, callback);
  if (nonEnumerable)
    return keysOf(obj, callback);
  if (inherited)
    return keysIn(obj, callback);
  return typeof callback === "function" ? keysIn(obj, (k) => Object.hasOwn(obj, k) && callback?.(k)) : Object.keys(obj);
}, "keys");
var extend = /* @__PURE__ */ __name((...args) => {
  const [target, obj, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...config } = options ?? {};
  const ret = copy ? deepcopy(target) : target;
  for (const p in obj)
    Object.defineProperty(ret, p, mapd(p, obj[p], config));
  return freeze ? Object.freeze(ret) : ret;
}, "extend");
var clear = /* @__PURE__ */ __name((obj, options) => {
  if (nullish(obj))
    return {};
  for (const key of keys(obj, options))
    delete obj[key];
  return obj;
}, "clear");
var pop = /* @__PURE__ */ __name((obj, key = Object.keys(obj ?? {}).pop()) => {
  if (nullish(obj))
    return;
  const value = obj[key];
  delete obj[key];
  return value;
}, "pop");
var findkey = /* @__PURE__ */ __name((obj, ...args) => {
  const { opts, callback } = mapargs(args, { callback: (k) => k });
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, opts, callback);
      if (resolved)
        return resolved;
    } else if (callback?.(value, key))
      return key;
  }
}, "findkey");
var map = /* @__PURE__ */ __name((obj, ...args) => {
  const result = {};
  const { opts, callback } = mapargs(args);
  const { deep, freeze, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    const entry = deep && isObject(value) ? [key, map(value, opts, callback)] : callback?.(key, value);
    if (isObject(entry))
      deepmergeInto(result, entry);
    else if (Array.isArray(entry)) {
      if (!Array.isArray(entry[0]))
        result[entry[0]] = entry[1];
      else
        for (let i = 0; i < entry.length; ++i) {
          const [key2, value2] = entry[i];
          result[key2] = value2;
        }
    }
  }
  return freeze ? Object.freeze(result) : result;
}, "map");
var filter = /* @__PURE__ */ __name((obj, ...args) => {
  const result = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: (entry) => !nullish(entry["value"])
  });
  opts["withRest"] && (opts["withRest"] = {});
  const { deep, freeze, withRest, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback?.({ key, value }))
        result[key] = value;
      else if (withRest)
        withRest[key] = value;
    } else {
      const opts2 = { deep, freeze, withRest: !!withRest, ...keyopts };
      const entry = filter(value, opts2, callback);
      const [resolved, omitted] = withRest ? entry : [entry, {}];
      Object.keys(omitted).length && (withRest[key] = omitted);
      result[key] = resolved;
    }
  }
  freeze && Object.freeze(result);
  return withRest ? [result, withRest] : result;
}, "filter");
var _ = Object.freeze({
  clear,
  extend,
  filter,
  findkey,
  keys,
  keysIn,
  keysOf,
  map,
  pop,
  props
});
var mapargs = /* @__PURE__ */ __name((args, init) => {
  const initopts = init?.opts ?? {};
  let [callback = init?.callback, opts = initopts] = args;
  if (typeof opts === "function" || typeof callback === "object") {
    [callback = init?.callback, opts = initopts] = [opts, callback];
  }
  if (opts["hidden"])
    opts["nonEnumerable"] || (opts["nonEnumerable"] = true);
  return { opts, callback };
}, "mapargs");
var mapd = /* @__PURE__ */ __name((property, value, options, resolver = (d) => Array.isArray(d) ? d.includes(property) : !!d) => ({
  value,
  writable: resolver(options.writable),
  enumerable: resolver(options.enumerable),
  configurable: resolver(options.configurable)
}), "mapd");

export { _, clear, extend, filter, findkey, keys, keysIn, keysOf, map, pop, props };
