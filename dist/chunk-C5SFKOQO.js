import { isObject } from './chunk-7U7BT2PX.js';
import { deepcopy, deepmergeInto } from './chunk-XHBJGOOA.js';
import { not } from './chunk-RN7E5BIZ.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/objects/index.ts
var extend = /* @__PURE__ */ __name((...args) => {
  const descriptorMap = {};
  const [target, props2, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, ...descriptors } = { ...options };
  for (const key in props2) {
    descriptorMap[key] = { ...descriptors, value: props2[key] };
  }
  return Object.defineProperties(
    copy ? deepcopy(target) : target,
    descriptorMap
  );
}, "extend");
var extendedkeys = /* @__PURE__ */ __name((obj) => {
  const result = [];
  for (const key in obj ?? {})
    result.push(key);
  return result;
}, "extendedkeys");
var props = /* @__PURE__ */ __name((obj) => {
  if (!obj)
    return [];
  const result = /* @__PURE__ */ new Set();
  do
    for (const prop of Object.getOwnPropertyNames(obj))
      result.add(prop);
  while (obj = Object.getPrototypeOf(obj));
  return [...result];
}, "props");
var pop = /* @__PURE__ */ __name((obj, key = Object.keys(obj ?? {}).pop()) => {
  if (!obj || !key)
    return;
  const value = obj[key];
  delete obj[key];
  return value;
}, "pop");
var clear = /* @__PURE__ */ __name((obj, options) => {
  const keys = keysDispatch(options);
  for (const key of keys(obj))
    delete obj[key];
  return obj;
}, "clear");
var findkey = /* @__PURE__ */ __name((obj, ...args) => {
  const { opts, callback } = parseRestArgs(args, {
    callback: (value) => !not(value)
  });
  const { deep, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj)) {
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
  const { opts, callback } = parseRestArgs(args);
  const { deep, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    const entry = deep && isObject(value) ? [key, map(value, { deep, keys }, callback)] : callback(key, value);
    const entries = Array.isArray(entry) && typeof entry[0] === "object" ? entry : [entry];
    entries.forEach(
      (entry2) => (isObject(entry2) ? deepmergeInto : assignEntry)(result, entry2)
    );
  }
  return result;
}, "map");
var filter = /* @__PURE__ */ __name((obj, ...args) => {
  const result = {};
  const { opts, callback } = parseRestArgs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: ({ value }) => typeof value !== "undefined"
  });
  opts["withRest"] && (opts["withRest"] = {});
  const { deep, withRest, ...keyopts } = opts;
  const keys = keysDispatch(keyopts);
  for (const key of keys(obj ?? {})) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (callback({ key, value }))
        result[key] = value;
      else if (withRest)
        withRest[key] = value;
    } else {
      const entry = filter(
        value,
        { deep, keys, withRest: !!withRest },
        callback
      );
      const [resolved, omitted] = withRest ? entry : [entry, {}];
      if (Object.keys(omitted).length)
        withRest[key] = omitted;
      result[key] = resolved;
    }
  }
  return withRest ? [result, withRest] : result;
}, "filter");
var object = Object.freeze({
  clear,
  extend,
  extendedkeys,
  filter,
  findkey,
  map,
  pop,
  props
});
var assignEntry = /* @__PURE__ */ __name((obj, entry) => not(entry?.[0]) || (obj[entry[0]] = entry[1]), "assignEntry");
var parseRestArgs = /* @__PURE__ */ __name((args, init = {}) => {
  for (const arg of args) {
    if (typeof arg === "object")
      init.opts = arg;
    else if (typeof arg === "function")
      init.callback = arg;
  }
  init.opts || (init.opts = {});
  init.callback || (init.callback = () => {
  });
  return init;
}, "parseRestArgs");
var keysDispatch = /* @__PURE__ */ __name((opts) => {
  if (!opts)
    return Object.keys;
  if (opts["keys"])
    return opts["keys"];
  if (opts.nonEnumerable) {
    if (opts.inherited)
      return props;
    return Object.getOwnPropertyNames;
  }
  if (opts.inherited)
    return extendedkeys;
  return Object.keys;
}, "keysDispatch");

export { clear, extend, extendedkeys, filter, findkey, map, object, pop, props };
