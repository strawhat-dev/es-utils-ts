import type { NumberLike } from '@/types';

/**
 * Schedules a `Promise` that resolves after a delay of `ms` milliseconds.
 */
export const sleep = async (ms: NumberLike): Promise<void> => {
  return new Promise((res) => setTimeout(res, +ms));
};

/**
 * Dynamically import any esm library from cdn (hosted on jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
export const cdn = async (name: string) => {
  const mod = await import(`https://esm.run/${name}`);
  return mod?.default || mod;
};
