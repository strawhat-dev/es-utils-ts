import { isObject, nullish } from './chunk-KWJFEMZN.js';
import { __name, escapeRegex, deepcopy, deepmergeInto } from './chunk-YRHHOPJS.js';

// src/common/lib.ts
var RE_FLAG_PATTERN = /[/]\b(?!\w*(\w)\w*\1)[dgimsuy]+\b$/;
var RE_FLAG_OPTION = Object.freeze({
  indices: "d",
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  dotAll: "s",
  unicode: "u",
  sticky: "y"
});
var defined = /* @__PURE__ */ __name((value) => value || value === 0 ? value : "", "defined");
var lines = /* @__PURE__ */ __name((s) => s.split(/\r?\n/).filter((line) => line.trim()), "lines");
var trimLines = /* @__PURE__ */ __name((s) => lines(s).join("\n"), "trimLines");
var t = /* @__PURE__ */ __name((raw, ...subs) => {
  let mapper = defined;
  typeof subs.at(-1) === "function" && (mapper = subs.pop());
  return String.raw({ raw }, ...subs.map((s) => mapper(s)));
}, "t");
var re = /* @__PURE__ */ __name((raw, ...subs) => {
  let [pattern, flags = ""] = [raw, subs[0]];
  if (Array.isArray(pattern) && "raw" in pattern) {
    subs.push(escapeRegex);
    pattern = t(raw, ...subs);
    flags = (pattern.match(RE_FLAG_PATTERN) || [""])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ""));
  } else if (isObject(flags)) {
    const options = flags;
    flags = "";
    for (const opt of keys(options))
      flags += RE_FLAG_OPTION[opt];
  }
  return new RegExp(pattern, flags);
}, "re");

// src/common/promises.ts
var ESM_CDN_URL = "https://esm.run";
var sleep = /* @__PURE__ */ __name(async (ms) => new Promise((res) => setTimeout(res, +ms)), "sleep");
var cdn = /* @__PURE__ */ __name(async (name) => {
  const mod = await import(`${ESM_CDN_URL}/${name}`);
  return mod?.default || mod;
}, "cdn");

// src/common/range.ts
var range = /* @__PURE__ */ __name((start = 0, stop, step) => {
  if (nullish(stop))
    [start, stop] = [0, start];
  if (nullish(step))
    step = stop < start ? -1 : 1;
  const n = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  const ret = new Array(n);
  for (let i = 0; i < n; ++i) {
    ret[i] = start;
    start += step;
  }
  return ret;
}, "range");
var Range = /* @__PURE__ */ __name((start = 0, stop, step, _incl) => {
  if (nullish(stop))
    [start, stop] = [0, start];
  if (nullish(step))
    step = stop < start ? -1 : 1;
  return Object.freeze(
    new Proxy(Object.freeze({}), {
      has(_2, n) {
        if (!/^\d+$/.test(n))
          return false;
        if (+n % step)
          return false;
        if (!step)
          return +n === start;
        if (start > stop) {
          return +n <= start && (_incl ? +n >= stop : +n > stop);
        }
        return +n >= start && (_incl ? +n <= stop : +n < stop);
      }
    })
  );
}, "Range");
var irange = /* @__PURE__ */ __name((...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i] < start ? --args[i] : ++args[i];
  return range(...args);
}, "irange");
var iRange = /* @__PURE__ */ __name((...args) => Range(...args), "iRange");

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
  const [target, obj, options] = args.length === 1 ? [{}, args.pop()] : args;
  const { copy, freeze, ...descriptors } = options ?? {};
  const ret = copy ? deepcopy(target) : target;
  for (const key in obj) {
    Object.defineProperty(ret, key, mapDescriptors(key, obj[key], descriptors));
  }
  return freeze ? Object.freeze(ret) : ret;
}, "extend");
var findkey = /* @__PURE__ */ __name((obj, ...args) => {
  const { opts, callback } = mapargs(args, {
    callback: (value) => defined(value)
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
  const result = {};
  const { opts, callback } = mapargs(args, {
    opts: { deep: !args.length, withRest: false },
    callback: (entry) => !nullish(entry["value"])
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

export { Range, _, cdn, clear, defined, extend, filter, findkey, iRange, irange, keys, keysIn, lines, map, pop, props, range, re, sleep, t, trimLines };
