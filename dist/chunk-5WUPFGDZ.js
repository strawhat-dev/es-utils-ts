import { not } from './chunk-HZA4J3R3.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/range.ts
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

export { Range, iRange, irange, range };
