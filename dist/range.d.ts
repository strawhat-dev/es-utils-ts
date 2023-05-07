/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given range (`start`, `stop`, `step`)
 */
declare const range: (start?: number, stop?: number, step?: number) => number[];
/**
 * Like {@link range}, except that an object *(where both the
 * keys and values are numbers within the provided range)* is returned
 * instead. This would allow one to semantically check if a given number
 * falls within a range similarly to *Python*.
 *
 * @example
 * if (score in Range(90, 100)) return 'A';
 */
declare const Range: (start?: number, stop?: number, step?: number) => Record<number, number>;
/**
 * Note: A decreasing range (`step = -1`) will be
 * automatically inferred if not specified and `start > stop`
 * or only a single negative `start` value is given.
 *
 * @returns an array of numbers within the given ***inclusive*** range (`start`, `stop`, `step`)
 */
declare const irange: (start?: number, stop?: number, step?: number) => number[];
/**
 * Like {@link irange}, except that an object *(where both the
 * keys and values are numbers within the provided range)* is returned
 * instead. This would allow one to semantically check if a given number
 * falls within a range similarly to *Python*.
 *
 * @example
 * if (score in iRange(90, 100)) return 'A';
 */
declare const iRange: (start?: number, stop?: number, step?: number) => Record<number, number>;

export { Range, iRange, irange, range };
