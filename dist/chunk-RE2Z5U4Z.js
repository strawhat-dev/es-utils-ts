import { nullish, not, isObject } from './chunk-XZH5SYJV.js';
import { __name, deepcopy, deepmergeInto } from './chunk-JGF42Q5W.js';

// src/objects/index.ts
var keysIn = /* @__PURE__ */ __name((obj) => {
  const result = [];
  for (const key in obj)
    result.push(key);
  return result;
}, "keysIn");
var props = /* @__PURE__ */ __name((obj, options = {}) => {
  const traverse = options.objectPrototype ? Object.getPrototypeOf : (obj2) => {
    const proto = Object.getPrototypeOf(obj2);
    if (proto !== Object.prototype)
      return proto;
  };
  const result = /* @__PURE__ */ new Set();
  do
    for (const prop of Object.getOwnPropertyNames(obj))
      result.add(prop);
  while (obj = traverse(obj));
  return [...result];
}, "props");
var pop = /* @__PURE__ */ __name((obj, key = Object.keys(obj ?? {}).pop()) => {
  if (nullish(obj))
    return;
  const value = obj[key];
  delete obj[key];
  return value;
}, "pop");
var clear = /* @__PURE__ */ __name((obj, options) => {
  if (nullish(obj))
    return {};
  const keys = keysDispatch(options);
  for (const key of keys(obj))
    delete obj[key];
  return obj;
}, "clear");
var extend = /* @__PURE__ */ __name((...args) => {
  const descriptorMap = {};
  const [target, props2, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...descriptors } = { ...options };
  for (const key in props2) {
    const value = props2[key];
    descriptorMap[key] = mapDescriptors(key, value, descriptors);
  }
  const ret = Object.defineProperties(
    copy ? deepcopy(target) : target,
    descriptorMap
  );
  return freeze ? Object.freeze(ret) : ret;
}, "extend");
var findkey = /* @__PURE__ */ __name((obj, ...args) => {
  const { opts, callback } = mapargs(args, {
    callback: (value) => !not(value)
  });
  const { deep, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    if (deep && isObject(value)) {
      const resolved = findkey(value, { deep, keys }, callback);
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
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    const entry = deep && isObject(value) ? [key, map(value, { deep, freeze, keys }, callback)] : callback(key, value);
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
  opts["withRest"] && (opts["withRest"] = {});
  const { deep, freeze, withRest, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value }))
        result[key] = value;
      else if (withRest)
        withRest[key] = value;
    } else {
      const opts2 = { deep, freeze, keys, withRest: !!withRest };
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
  keysIn,
  map,
  pop,
  props
});
var mapargs = /* @__PURE__ */ __name((args, init = {}) => {
  for (const arg of args) {
    if (isObject(arg))
      init.opts = arg;
    else if (typeof arg === "function")
      init.callback = arg;
  }
  init.opts || (init.opts = {});
  init.callback || (init.callback = () => {
  });
  return init;
}, "mapargs");
var mapDescriptors = /* @__PURE__ */ __name((property, value, options, resolver = (d) => Array.isArray(d) ? d.includes(property) : !!d) => ({
  value,
  writable: resolver(options.writable),
  enumerable: resolver(options.enumerable),
  configurable: resolver(options.configurable)
}), "mapDescriptors");
var keysDispatch = /* @__PURE__ */ __name((opts) => {
  let keys;
  if (!opts)
    return Object.keys;
  if (keys = opts["keys"])
    return keys;
  if (opts["nonEnumerable"]) {
    if (opts["inherited"])
      return props;
    return Object.getOwnPropertyNames;
  }
  if (opts["inherited"])
    return keysIn;
  return Object.keys;
}, "keysDispatch");

export { _, clear, extend, filter, findkey, keysIn, map, pop, props };
