/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NumberLike } from '@/types';

const ESM_CDN_URL = 'https://esm.run';

// prettier-ignore
/** Schedules a `Promise` that resolves after a delay of `ms` milliseconds. */
export const sleep = async (ms: NumberLike): Promise<void> => new Promise((res) => setTimeout(res, +ms));

/**
 * Dynamically import any *esm* module using a cdn (jsdelivr).
 * @see {@link https://www.jsdelivr.com/esm}
 */
export const cdn = async <T = any>(name: string): Promise<T> => {
  const mod = await import(`${ESM_CDN_URL}/${name}`);
  return mod?.default || mod;
};