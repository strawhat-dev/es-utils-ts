import { a as NumberLike } from './types-5f7dc540.js';
import './conditional-keys.d-ac881611.js';

/** Schedules a `Promise` that resolves after a delay of `ms` milliseconds. */
declare const sleep: (ms: NumberLike) => Promise<void>;
/**
 * Dynamically import any *esm* module using a cdn (jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
declare const cdn: <T = any>(name: string) => Promise<T>;

export { cdn, sleep };
