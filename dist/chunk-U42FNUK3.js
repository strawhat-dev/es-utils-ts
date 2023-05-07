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
var Range = /* @__PURE__ */ __name((start = 0, stop, step) => {
  const result = {};
  if (not(stop))
    [start, stop] = [0, start];
  if (not(step))
    step = stop < start ? -1 : 1;
  let n = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  while (n--) {
    result[start] = start;
    start += step;
  }
  return result;
}, "Range");
var irange = /* @__PURE__ */ __name((...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i] < start ? --args[i] : ++args[i];
  return range(...args);
}, "irange");
var iRange = /* @__PURE__ */ __name((...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i] < start ? --args[i] : ++args[i];
  return Range(...args);
}, "iRange");

export { Range, iRange, irange, range };
