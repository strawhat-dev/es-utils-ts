import { not, isObject } from './chunk-3SYFIDX2.js';
import { deepmergeInto } from './chunk-3OAH732U.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/objects/index.ts
var clear = /* @__PURE__ */ __name((obj) => {
  for (const key in Object.keys(obj))
    delete obj[key];
  return obj;
}, "clear");
var findkey = /* @__PURE__ */ __name((obj, predicate = (value) => !not(value)) => {
  for (const key of Object.keys(obj || {})) {
    if (predicate(obj[key], key))
      return key;
  }
}, "findkey");
var map = /* @__PURE__ */ __name((obj, ...args) => {
  const result = {};
  const callback = args.pop();
  const { deep } = { ...args.pop() };
  for (const key of Object.keys(obj || {})) {
    const value = obj[key];
    const entry = deep && isObject(value) ? [key, map(value, { deep }, callback)] : callback(key, value);
    const entries = Array.isArray(entry) && typeof entry[0] === "object" ? entry : [entry];
    entries.forEach(
      (entry2) => (isObject(entry2) ? deepmergeInto : assignEntry)(result, entry2)
    );
  }
  return result;
}, "map");
var filter = /* @__PURE__ */ __name((obj, ...args) => {
  const defaults = {
    opts: { deep: !args.length, withRest: false },
    predicate: ({ value }) => typeof value !== "undefined"
  };
  const { opts, predicate } = args.reduce((acc, arg) => {
    if (isObject(arg))
      acc.opts = arg;
    else if (typeof arg === "function")
      acc.predicate = arg;
    return acc;
  }, defaults);
  const result = {};
  opts.withRest && (opts.withRest = {});
  const { deep, withRest } = opts;
  for (const key of Object.keys(obj || {})) {
    const value = obj[key];
    if (!(deep && isObject(value))) {
      if (predicate({ key, value }))
        result[key] = value;
      else if (withRest)
        withRest[key] = value;
    } else {
      const entry = filter(
        value,
        { deep, withRest: !!withRest },
        predicate
      );
      const [resolved, omitted] = withRest ? entry : [entry, {}];
      result[key] = resolved;
      Object.keys(omitted).length && (withRest[key] = omitted);
    }
  }
  return withRest ? [result, withRest] : result;
}, "filter");
var extend = /* @__PURE__ */ __name((...args) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  const source = {};
  for (const key of Object.keys(props)) {
    source[key] = { ...options, value: props[key] };
  }
  return Object.defineProperties(target, source);
}, "extend");
var assignEntry = /* @__PURE__ */ __name((obj, entry) => {
  not(entry?.[0]) || (obj[entry[0]] = entry[1]);
}, "assignEntry");

export { clear, extend, filter, findkey, map };
