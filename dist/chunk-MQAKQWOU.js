import { isprimitive, not, isobject } from './chunk-SW3RGDPZ.js';
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
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = isprimitive(value) ? value : deepcopy(value, hashmap);
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
var findkey = (obj, predicate = (value) => !not(value)) => {
  return Object.keys(obj || {}).find(
    (k) => predicate(obj[k], k)
  );
};
var map = (obj, ...args) => {
  let [mapper, opts = { deep: false }] = args;
  if (isobject(mapper) || typeof opts === "function") {
    [mapper, opts] = [opts, mapper];
  }
  const { deep } = { ...opts };
  const result = Object.entries(obj || {}).reduce((acc, [key, value]) => {
    const entry = deep && isobject(value) ? [key, map(value, { deep }, mapper)] : mapper(key, value);
    if (!entry)
      return acc;
    const entries = Array.isArray(entry) ? entry : [entry];
    if (isobject(entries[0]))
      return deepmerge(acc, ...entries);
    (Array.isArray(entries[0]) ? entries : [entries]).forEach(
      ([k, v]) => not(k) || (acc[k] = v)
    );
    return acc;
  }, {});
  return result;
};
var filter = (obj, ...args) => {
  let [
    predicate = ({ value }) => typeof value !== "undefined",
    opts = { deep: !args.length, withRest: false }
  ] = args;
  if (isobject(predicate) || typeof opts === "function") {
    [predicate, opts] = [opts, predicate];
  }
  const { deep, withRest } = { ...opts };
  const [filtered, rest] = Object.entries(obj || {}).reduce(
    ([acc, omit], [key, value]) => {
      if (deep && isobject(value)) {
        value = filter(value, { deep }, predicate);
      }
      (predicate({ key, value }) ? acc : omit)[key] = value;
      return [acc, omit];
    },
    [{}, {}]
  );
  return withRest ? [filtered, rest] : filtered;
};

export { clear, deepcopy, extend, filter, findkey, map };
