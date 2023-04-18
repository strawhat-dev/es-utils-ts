import { extend } from '@/objects';
import { nullish } from '@/conditionals';

/**
 * Generates a range of numbers, however implemented as an iterator
 * and does not create a new array unlike most range implementations,
 * unless an array method is called. Trap for `in` operator via `Proxy`
 * is also implemented to allow for the "python-like" behavior of quickly
 * testing if a number falls between a range of numbers.
 * i.e.
 * ```ts
 * if (score in range(90, 100)) grade = 'A'
 * // instead of...
 * if (score >= 90 && score < 100) grade = 'A'
 * ```
 */
export const range = (start = 0, stop?: number, step?: number) => {
  const r = getRangeProperties(start, stop, step);
  const generator = {
    *[Symbol.iterator]() {
      let curr = r.start;
      for (let i = 0; i < r.length; ++i) {
        yield curr;
        curr += r.step;
      }
    },
  } as number[];

  const methods = getMethods(Array.prototype).reduce((acc, method) => {
    acc[method] = (...args: unknown[]) => [...generator][method](...args);
    return acc;
  }, r);

  return new Proxy(extend(generator, methods), {
    has(_, n: string) {
      if (!/^\d+$/.test(n)) return false;
      if (+n % r.step) return false;
      if (!r.step) return +n === r.start;
      if (r.start > r.stop) {
        return +n <= r.start && +n > r.stop;
      }

      return +n >= r.start && +n < r.stop;
    },
  });
};

/** @internal */
const getMethods = (obj: object) => {
  return Object.getOwnPropertyNames(obj).filter(
    (p) => typeof obj[p] === 'function' && p !== 'constructor'
  );
};

/** @internal */
const getRangeProperties = (start = 0, stop?: number, step?: number) => {
  if (nullish(stop)) [start, stop] = [0, start];
  step ??= stop < start ? -1 : 1;
  const length = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  return { start, stop, step, length };
};
