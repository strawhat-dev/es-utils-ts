import { keys } from './chunk-2YUSVHLD.js';
import { isTemplateStringsArray, nullish } from './chunk-R2HOTKJN.js';
import { __name, escapeRegex } from './chunk-ETHVEPTR.js';

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
var linesOf = /* @__PURE__ */ __name((s) => {
  const ret = [];
  const lines = s.split(/\r?\n/);
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    line.trim() && ret.push(line);
  }
  return ret;
}, "linesOf");
var trimLines = /* @__PURE__ */ __name((s) => linesOf(s).join("\n").trim(), "trimLines");
var t = /* @__PURE__ */ __name((raw, ...subs) => {
  let callback = defined;
  typeof subs.at(-1) === "function" && (callback = subs.pop());
  for (let i = 0; i < subs.length; ++i)
    subs[i] = callback(subs[i]);
  return String.raw({ raw }, ...subs);
}, "t");
var re = /* @__PURE__ */ __name((raw, ...subs) => {
  let [pattern, flags = ""] = [raw, subs[0]];
  if (isTemplateStringsArray(raw)) {
    subs.push(escapeRegex);
    pattern = t(raw, ...subs);
    flags = (pattern.match(RE_FLAG_PATTERN) || [""])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ""));
  } else if (typeof flags === "object") {
    const opts = flags;
    flags = "";
    for (const opt of keys(opts, { defined: true })) {
      flags += RE_FLAG_OPTION[opt] ?? "";
    }
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
      has(_, n) {
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

export { Range, cdn, defined, iRange, irange, linesOf, range, re, sleep, t, trimLines };
