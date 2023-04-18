import { isprimitive, isobject, nullishFalse } from './chunk-OFUMZCYK.js';
import { deepmerge } from 'deepmerge-ts';

var clear = (obj) => {
  Object.keys(obj).forEach((k) => delete obj[k]);
  return obj;
};
var deepcopy = (obj, hashmap = /* @__PURE__ */ new WeakMap()) => {
  if (hashmap.has(obj))
    return hashmap.get(obj);
  const target = Array.isArray(obj) ? [] : {};
  hashmap.set(obj, target);
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[k] = isprimitive(v) ? v : deepcopy(v, hashmap);
    return acc;
  }, target);
};
var extend = (target, props, options) => {
  if (!props)
    [target, props] = [{}, target];
  return Object.defineProperties(
    target,
    Object.entries(props).reduce((acc, [prop, value]) => {
      acc[prop] = { ...options, value };
      return acc;
    }, {})
  );
};
var findkey = (obj, predicate) => {
  predicate || (predicate = (value) => !nullishFalse(value));
  return Object.keys(obj || {}).find(
    (k) => predicate(obj[k], k)
  );
};
var map = (obj, ...args) => {
  let [mapper, opts = { deep: false, chainMethods: true }] = args;
  if (typeof opts === "function") {
    [mapper, opts] = [opts, mapper];
  }
  const { deep, chainMethods } = opts;
  const result = Object.entries(obj || {}).reduce((acc, [key, val]) => {
    const entry = deep && isobject(val) ? [key, map(val, { deep, chainMethods: false }, mapper)] : mapper(key, val);
    if (!entry)
      return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (isobject(entries[0]))
      return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => nullishFalse(k) || (acc[k] = v)
    );
    return acc;
  }, {});
  return chainMethods ? extended(result) : result;
};
var filter = (obj, ...args) => {
  const defaultOpts = {
    deep: !args.length,
    withRest: false,
    chainMethods: true
  };
  let [
    opts = defaultOpts,
    predicate = ({ value }) => typeof value !== "undefined"
  ] = args;
  if (typeof opts === "function") {
    [opts, predicate] = [defaultOpts, opts];
  }
  const { deep, withRest, chainMethods } = opts;
  let [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isobject(value)) {
        value = filter(value, { deep, chainMethods: false }, predicate);
      }
      (predicate({ key, value }) ? acc : omit)[key] = value;
      return [acc, omit];
    },
    [{}, {}]
  );
  chainMethods && ([filtered, rest] = [extended(filtered), extended(rest)]);
  return withRest ? [filtered, rest] : filtered;
};
var extended = (obj) => {
  const $MAP = (...args) => map(obj, ...args);
  const $FILTER = (...args) => filter(obj, ...args);
  const $FINDKEY = (predicate) => findkey(obj, predicate);
  return extend(
    obj,
    [$MAP, $FILTER, $FINDKEY].reduce((acc, fn) => {
      const { name } = fn;
      const prop = name.slice(1).toLowerCase();
      if (!Object.hasOwn(obj, prop) || typeof obj[prop] === "function" && obj[prop].name === name) {
        acc[prop] = fn;
      }
      return acc;
    }, {}),
    { configurable: true, writable: true }
  );
};

export { clear, deepcopy, extend, filter, findkey, map };
