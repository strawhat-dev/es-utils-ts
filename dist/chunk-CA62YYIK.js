import { not, isObject, is } from './chunk-QCJB23HO.js';
import { deepmergeInto } from './chunk-RKAOVNDO.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/objects/index.ts
var clear = /* @__PURE__ */ __name((obj) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
}, "clear");
var extend = /* @__PURE__ */ __name((...args) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  return Object.defineProperties(
    target,
    Object.entries(props).reduce(
      (acc, [prop, value]) => (acc[prop] = { ...options, value }, acc),
      {}
    )
  );
}, "extend");
var findkey = /* @__PURE__ */ __name((obj, predicate = (value) => !not(value)) => {
  return Object.keys(obj || {}).find(
    (key) => predicate(obj[key], key)
  );
}, "findkey");
var map = /* @__PURE__ */ __name((obj, ...args) => {
  const callback = args.pop();
  const { deep } = { ...args.pop() };
  return Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const result = deep && isObject(value) ? [key, map(value, { deep }, callback)] : callback(key, value);
    if (!is(result).anyOf("Array", "Object"))
      return acc;
    const entries = Array.isArray(result) && typeof result[0] === "object" ? result : [result];
    entries.forEach(
      (entry) => (Array.isArray(entry) ? assignEntry : deepmergeInto)(acc, entry)
    );
    return acc;
  }, {});
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
  const { deep, withRest } = opts;
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isObject(value)) {
        const [resolved, omitted] = filter(
          value,
          { deep, withRest: true },
          predicate
        );
        acc[key] = resolved;
        Object.keys(omitted).length && (omit[key] = omitted);
      } else {
        (predicate({ key, value }) ? acc : omit)[key] = value;
      }
      return [acc, omit];
    },
    [{}, {}]
  );
  return withRest ? [filtered, rest] : filtered;
}, "filter");
var assignEntry = /* @__PURE__ */ __name((obj, [k, v]) => not(k) || (obj[k] = v), "assignEntry");

export { clear, extend, filter, findkey, map };
