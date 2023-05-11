import { NumberLike } from '../types.js';
import '../conditional-except.d-c99547cb.js';
import './writable.js';
import 'type-fest/source/async-return-type.js';
import 'type-fest/source/merge-deep.js';

/** Schedules a `Promise` that resolves after a delay of `ms` milliseconds. */
declare const sleep: (ms: NumberLike) => Promise<void>;
/**
 * Dynamically import any *esm* module using a cdn (jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
declare const cdn: <T = any>(name: string) => Promise<T>;

/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given range (`start`, `stop`, `step`)
 */
declare const range: (start?: number, stop?: number, step?: number) => number[];
/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given ***inclusive*** range (`start`, `stop`, `step`)
 */
declare const irange: (start?: number, stop?: number, step?: number) => number[];
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
declare const Range: (start?: number, stop?: number, step?: number) => {};
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
declare const iRange: (start?: number, stop?: number, step?: number) => {};

/** trims a given string while also removing all empty lines */
declare const trimLines: (s: string) => string;

export { Range, cdn, iRange, irange, range, sleep, trimLines };
