/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { not } from '@/conditionals';

/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given range (`start`, `stop`, `step`)
 */
export const range = (start = 0, stop?: number, step?: number) => {
  if (not(stop)) [start, stop] = [0, start];
  if (not(step)) step = stop < start ? -1 : 1;
  const n = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  const result: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = start;
    start += step;
  }

  return result;
};

/**
 * Like {@link range}, except that an object *(where both the
 * keys and values are numbers within the provided range)* is returned
 * instead. This would allow one to semantically check if a given number
 * falls within a range similarly to *Python*.
 *
 * @example
 * if (score in Range(90, 100)) return 'A';
 */
export const Range = (start = 0, stop?: number, step?: number) => {
  const result = {};
  if (not(stop)) [start, stop] = [0, start];
  if (not(step)) step = stop < start ? -1 : 1;
  let n = Math.max(0, Math.ceil((stop - start) / (step || 1)));
  while (n--) {
    result[start] = start;
    start += step;
  }

  return result as Record<number, number>;
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
  args[i]! < start! ? --args[i]! : ++args[i]!;
  return range(...args);
}) as typeof range;

/**
 * Like {@link irange}, except that an object *(where both the
 * keys and values are numbers within the provided range)* is returned
 * instead. This would allow one to semantically check if a given number
 * falls within a range similarly to *Python*.
 *
 * @example
 * if (score in iRange(90, 100)) return 'A';
 */
export const iRange = ((...args) => {
  const [i, start] = args.length > 1 ? [1, args[0]] : [0, 0];
  args[i]! < start! ? --args[i]! : ++args[i]!;
  return Range(...args);
}) as typeof Range;
