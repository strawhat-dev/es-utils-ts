import { assert, not } from './chunk-DE7BSBPC.js';
import { deepmerge } from 'deepmerge-ts';

var clear = (obj) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
};
var deepcopy = (obj, hash = /* @__PURE__ */ new WeakMap()) => {
  if (hash.has(obj))
    return hash.get(obj);
  const target = Array.isArray(obj) ? [] : {};
  hash.set(obj, target);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = assert.isPrimitive(value) ? value : deepcopy(value, hash);
    return acc;
  }, target);
};
var findkey = (obj, predicate = (value) => !not(value)) => {
  return Object.keys(obj || {}).find((k) => predicate(obj[k], k));
};
var extend = (...args) => {
  const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
  return Object.defineProperties(
    target,
    Object.entries(props).reduce((acc, [prop, value]) => {
      acc[prop] = { ...options, value };
      return acc;
    }, {})
  );
};
var map = (obj, ...args) => {
  const callback = args.pop();
  const { deep } = { ...args.pop() };
  return Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const entry = deep && assert.isObject(value) ? [key, map(value, { deep }, callback)] : callback(key, value);
    if (!entry)
      return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (assert.isObject(entries[0]))
      return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => not(k) || (acc[k] = v)
    );
    return acc;
  }, {});
};
var filter = (obj, ...args) => {
  const defaults = {
    opts: { deep: !args.length, withRest: false },
    predicate: ({ value }) => typeof value !== "undefined"
  };
  const { opts, predicate } = args.reduce((acc, arg) => {
    if (assert.isObject(arg))
      acc.opts = arg;
    else if (typeof arg === "function")
      acc.predicate = arg;
    return acc;
  }, defaults);
  const { deep, withRest } = opts;
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      (predicate({ key, value }) ? acc : omit)[key] = deep && assert.isObject(value) ? filter(value, { deep }, predicate) : value;
      return [acc, omit];
    },
    [{}, {}]
  );
  return withRest ? [filtered, rest] : filtered;
};

export { clear, deepcopy, extend, filter, findkey, map };
