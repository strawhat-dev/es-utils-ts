import { nullish } from './chunk-WEJR7A5E.js';

// src/common/promises.ts
var ESM_CDN_URL = "https://esm.run";
var sleep = async (ms) => new Promise((res) => setTimeout(res, +ms));
var cdn = async (name) => {
  const mod = await import(`${ESM_CDN_URL}/${name}`);
  return mod?.default || mod;
};

// src/common/range.ts
var range = (start = 0, stop, step) => {
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
};
var Range = (start = 0, stop, step, _incl) => {
  if (nullish(stop))
    [start, stop] = [0, start];
  if (nullish(step))
    step = stop < start ? -1 : 1;
  return new Proxy(
    {},
    {
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
    }
  );
};
var irange = (...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i] < start ? --args[i] : ++args[i];
  return range(...args);
};
var iRange = (...args) => Range(...args);

export { Range, cdn, iRange, irange, range, sleep };
