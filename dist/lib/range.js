/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { not } from '../conditionals';
/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given range (`start`, `stop`, `step`)
 */
export const range = (start = 0, stop, step) => {
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
};
/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given ***inclusive*** range (`start`, `stop`, `step`)
 */
export const irange = ((...args) => {
    const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
    args[i] < start ? --args[i] : ++args[i];
    return range(...args);
});
/**
 * Allows one to semantically check if a given number
 * falls within a range similarly to *Python* by utilizing
 * a `Proxy` and creating a trap for the `in` operator.
 *
 * @see {@link range} for normal range usage
 *
 * @example
 * if (score in Range(90, 100)) return 'A';
 */
export const Range = (start = 0, stop, step) => {
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
        },
    });
};
/**
 * Allows one to semantically check if a given number
 * falls within an ***inclusive*** range similarly to *Python* by
 * utilizing a `Proxy` and creating a trap for the `in` operator.
 *
 * @see {@link irange} for normal irange usage
 *
 * @example
 * if (score in iRange(90, 100)) return 'A';
 */
export const iRange = (start = 0, stop, step) => {
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
        },
    });
};
