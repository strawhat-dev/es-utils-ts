import { not } from './chunk-HL4E3HPN.js';
import { __name } from './chunk-JXJLGDKJ.js';

// src/lib/range.ts
var range = /* @__PURE__ */ __name((start = 0, stop, step) => {
  if (not(stop))
    [start, stop] = [0, start];
  if (not(step))
    step = stop < start ? -1 : 1;
  const n = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = start;
    start += step;
  }
  return result;
}, "range");
var irange = /* @__PURE__ */ __name((...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i] < start ? --args[i] : ++args[i];
  return range(...args);
}, "irange");
var Range = /* @__PURE__ */ __name((start = 0, stop, step) => {
  if (not(stop))
    [start, stop] = [0, start];
  if (not(step))
    step = stop < start ? -1 : 1;
  return new Proxy({}, {
    has(_, n) {
      if (!/^\d+$/.test(n))
        return false;
      if (+n % step)
        return false;
      if (!step)
        return +n === start;
      if (start > stop) {
        return +n <= start && +n > stop;
      }
      return +n >= start && +n < stop;
    }
  });
}, "Range");
var iRange = /* @__PURE__ */ __name((start = 0, stop, step) => {
  if (not(stop))
    [start, stop] = [0, start];
  if (not(step))
    step = stop < start ? -1 : 1;
  return new Proxy({}, {
    has(_, n) {
      if (!/^\d+$/.test(n))
        return false;
      if (+n % step)
        return false;
      if (!step)
        return +n === start;
      if (start > stop) {
        return +n <= start && +n >= stop;
      }
      return +n >= start && +n <= stop;
    }
  });
}, "iRange");

// src/lib/promises.ts
var ESM_CDN_URL = "https://esm.run";
var sleep = /* @__PURE__ */ __name(async (ms) => new Promise((res) => setTimeout(res, +ms)), "sleep");
var cdn = /* @__PURE__ */ __name(async (name) => {
  const mod2 = await import(`${ESM_CDN_URL}/${name}`);
  return mod2?.default || mod2;
}, "cdn");

// src/lib/index.ts
var trimLines = /* @__PURE__ */ __name((s) => s.split(/\r?\n/).filter((line) => line.trim()).join("\n"), "trimLines");
var add = /* @__PURE__ */ __name((a, b) => a + b, "add");
var sub = /* @__PURE__ */ __name((a, b) => a - b, "sub");
var mult = /* @__PURE__ */ __name((a, b) => a * b, "mult");
var div = /* @__PURE__ */ __name((a, b) => a / b, "div");
var mod = /* @__PURE__ */ __name((a, b) => a % b, "mod");
var lt = /* @__PURE__ */ __name((a, b) => a < b, "lt");
var gt = /* @__PURE__ */ __name((a, b) => a > b, "gt");
var lte = /* @__PURE__ */ __name((a, b) => a <= b, "lte");
var gte = /* @__PURE__ */ __name((a, b) => a >= b, "gte");

export { Range, add, cdn, div, gt, gte, iRange, irange, lt, lte, mod, mult, range, sleep, sub, trimLines };
