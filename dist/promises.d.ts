import { a as NumberLike } from './types-3dcf6e43.js';

/**
 * Schedules a `Promise` that resolves after a delay of `ms` milliseconds.
 */
declare const sleep: (ms: NumberLike) => Promise<void>;
/**
 * Dynamically import any esm library from cdn (hosted on jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
declare const cdn: (name: string) => Promise<any>;

export { cdn, sleep };
