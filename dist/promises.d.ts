import { a as NumberLike } from './types-1a12439f.js';

/**
 * Schedules a `Promise` that resolves after a delay of `ms` milliseconds.
 */
declare const sleep: (ms: NumberLike) => Promise<void>;
/**
 * Dynamically import any esm library from a cdn (hosted by jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
declare const cdn: (name: string) => Promise<any>;

export { cdn, sleep };
