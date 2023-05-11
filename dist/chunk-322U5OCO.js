import { nullish, not, isObject } from './chunk-BPNVOCZU.js';
import { __name, deepcopy, deepmergeInto } from './chunk-Q47Q2FLE.js';

// src/objects/index.ts
var keys = /* @__PURE__ */ __name((obj, options) => {
  if (nullish(obj))
    return [];
  const { inherited, nonEnumerable } = options ?? {};
  if (inherited && nonEnumerable)
    return props(obj);
  if (nonEnumerable)
    return Object.getOwnPropertyNames(obj);
  if (inherited)
    return keysIn(obj);
  return Object.keys(obj);
}, "keys");
var keysIn = /* @__PURE__ */ __name((obj) => {
  const ret = [];
  for (const key in obj)
    ret.push(key);
  return ret;
}, "keysIn");
var props = /* @__PURE__ */ __name((obj) => {
  const ret = /* @__PURE__ */ new Set();
  do
    for (const prop of Object.getOwnPropertyNames(obj))
      ret.add(prop);
  while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype);
  return [...ret];
}, "props");
var clear = /* @__PURE__ */ __name((obj, options) => {
  if (nullish(obj))
    return {};
  for (const key of keys(obj, options))
    delete obj[key];
  return obj;
}, "clear");
var pop = /* @__PURE__ */ __name((obj, key = keys(obj).pop()) => {
  if (nullish(obj))
    return;
  const value = obj[key];
  delete obj[key];
  return value;
}, "pop");
var extend = /* @__PURE__ */ __name((...args) => {
  const [target, props2, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...descriptors } = options ?? {};
  const ret = copy ? deepcopy(target) : target;
  for (const key in props2) {
    Object.defineProperty(
      ret,
      key,
      mapDescriptors(key, props2[key], descriptors)
    );
  }
  return freeze ? Object.freeze(ret) : ret;
}, "extend");
var findkey = /* @__PURE__ */ __name((obj, ...args) => {
  const { opts, callback } = mapargs(args, {
    callback: (value) => !not(value)
  });
  const { deep, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, opts, callback);
      if (resolved)
        return resolved;
    } else if (callback(value, key))
      return key;
  }
}, "findkey");
var map = /* @__PURE__ */ __name((obj, ...args) => {
  const result = {};
  const { opts, callback } = mapargs(args);
  const { deep, freeze, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    const entry = deep && isObject(value) ? [key, map(value, opts, callback)] : callback(key, value);
    if (isObject(entry))
      deepmergeInto(result, entry);
    else if (Array.isArray(entry)) {
      (Array.isArray(entry[0]) ? entry : [entry]).forEach(
        ([k, v]) => result[k] = v
      );
    }
  }
  return freeze ? Object.freeze(result) : result;
}, "map");
var filter = /* @__PURE__ */ __name((obj, ...args) => {
  let result = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: ({ value }) => typeof value !== "undefined"
  });
  opts["withRest"] &&= {};
  const { deep, freeze, withRest, ...keyopts } = opts;
  for (const key of keys(obj, keyopts)) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value }))
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
  freeze && (result = Object.freeze(result));
  return withRest ? [result, withRest] : result;
}, "filter");
var _ = Object.freeze({
  clear,
  extend,
  filter,
  findkey,
  keys,
  keysIn,
  map,
  pop,
  props
});
var mapargs = /* @__PURE__ */ __name((args, init = {}) => {
  for (const arg of args) {
    if (typeof arg === "function")
      init.callback = arg;
    else if (typeof arg === "object")
      init.opts = arg;
  }
  init.opts ||= {};
  init.callback ||= () => {
  };
  return init;
}, "mapargs");
var mapDescriptors = /* @__PURE__ */ __name((property, value, options, resolver = (d) => Array.isArray(d) ? d.includes(property) : !!d) => ({
  value,
  writable: resolver(options.writable),
  enumerable: resolver(options.enumerable),
  configurable: resolver(options.configurable)
}), "mapDescriptors");

export { _, clear, extend, filter, findkey, keys, keysIn, map, pop, props };
