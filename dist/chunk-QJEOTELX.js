import { extend } from './chunk-7CR3KHVX.js';
import { nullish } from './chunk-OFUMZCYK.js';

// src/range.ts
var range = (start = 0, stop, step) => {
  const r = getRangeProperties(start, stop, step);
  const generator = {
    *[Symbol.iterator]() {
      let curr = r.start;
      for (let i = 0; i < r.length; ++i) {
        yield curr;
        curr += r.step;
      }
    }
  };
  const methods = getMethods(Array.prototype).reduce((acc, method) => {
    acc[method] = (...args) => [...generator][method](...args);
    return acc;
  }, r);
  return new Proxy(extend(generator, methods), {
    has(_, n) {
      if (!/^\d+$/.test(n))
        return false;
      if (+n % r.step)
        return false;
      if (!r.step)
        return +n === r.start;
      if (r.start > r.stop) {
        return +n <= r.start && +n > r.stop;
      }
      return +n >= r.start && +n < r.stop;
    }
  });
};
var getMethods = (obj) => {
  return Object.getOwnPropertyNames(obj).filter(
    (p) => typeof obj[p] === "function" && p !== "constructor"
  );
};
var getRangeProperties = (start = 0, stop, step) => {
  if (nullish(stop))
    [start, stop] = [0, start];
  step ?? (step = stop < start ? -1 : 1);
  const length = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  return { start, stop, step, length };
};

export { range };
