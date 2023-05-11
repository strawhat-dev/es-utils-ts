import { not } from './chunk-BPNVOCZU.js';
import { __name } from './chunk-Q47Q2FLE.js';

// src/lib/promises.ts
var ESM_CDN_URL = "https://esm.run";
var sleep = /* @__PURE__ */ __name(async (ms) => new Promise((res) => setTimeout(res, +ms)), "sleep");
var cdn = /* @__PURE__ */ __name(async (name) => {
  const mod = await import(`${ESM_CDN_URL}/${name}`);
  return mod?.default || mod;
}, "cdn");

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

// src/lib/index.ts
var trimLines = /* @__PURE__ */ __name((s) => s.split(/\r?\n/).filter((line) => line.trim()).join("\n"), "trimLines");

export { Range, cdn, iRange, irange, range, sleep, trimLines };
