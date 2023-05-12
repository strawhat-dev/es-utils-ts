import type { NumberLike } from '../types';
/** Schedules a `Promise` that resolves after a delay of `ms` milliseconds. */
export declare const sleep: (ms: NumberLike) => Promise<void>;
/**
 * Dynamically import any *esm* module using a cdn (jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
export declare const cdn: <T = any>(name: string) => Promise<T>;
//# sourceMappingURL=promises.d.ts.map