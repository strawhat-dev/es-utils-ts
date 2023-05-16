import { Nullish, NumberLike } from './type-utils.js';

type TaggedTemplate = <T>(raw: TemplateStringsArray, ...subs: T[] | [...T[], (sub: T) => unknown]) => string;
type RegexBuilder = {
    (pattern: string | RegExp, flags?: string | RegexOptions): RegExp;
    (raw: TemplateStringsArray, ...subs: unknown[]): RegExp;
};
type RegexOptions = {
    /**
     * **[`d` flag ]** - Generate indices for substring matches.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/hasIndices}
     */
    indices?: boolean;
    /**
     * **[`g` flag ]** - Global search.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global}
     */
    global?: boolean;
    /**
     * **[`i` flag ]** - Case-insensitive search.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase}
     */
    ignoreCase?: boolean;
    /**
     * **[`m` flag ]** - Allows `^` and `$` to match newline characters.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline}
     */
    multiline?: boolean;
    /**
     * **[`s` flag ]** - Allows `.` to match newline characters.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll}
     */
    dotAll?: boolean;
    /**
     * **[`u` flag ]** - "Unicode"; treat a pattern as a sequence of Unicode code points.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode}
     */
    unicode?: boolean;
    /**
     * **[`y` flag ]** - Perform a "sticky" search that matches starting at the current position in the target string.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
     */
    sticky?: boolean;
};

/**
 * Coerces the given `value` to an **empty string** if it is `false`, `undefined`, `null`, or `NaN`,
 * otherwise returns the `value` as is. Useful in short-circuit evaluation or initialization where
 * you would need to check if the value is falsy **(except `0`)**, while returning `''` instead
 * *(which would also be falsy)*, as opposed to a `boolean`.
 */
declare const defined: <T>(value: T) => T extends false | Nullish ? "" : NonNullable<T>;
/**
 * @returns an array of *all* **non-empty** lines of the given string.
 */
declare const linesOf: (s: string) => string[];
/**
 * @returns the *trimmed* string with *all* **empty** lines removed.
 */
declare const trimLines: (s: string) => string;
/**
 * Tag function that rebuilds and returns the rebuilt string, but with each sub of
 * `subs` coerced and mapped to an *empty string* if `nullish` or `false` *(by default)*. \
 * Optionally a callback may be provided, in which the `subs` may be customly mapped instead.
 */
declare const t: TaggedTemplate;
/**
 * Like the `RegExp` constructor with the following enhancements:
 * - When invoked as a **tagged template**, any expression interpolated will be *escaped* for regex.
 * - The `flags` argument may also optionally be provided as an {@link RegexOptions | options object}
 *   that maps to the corresponding flags (with typed completions) for better readability.
 * - Regular expression flags may still be provided when invoked as tag function by simply
 *   including the desired flags at the end (as with normal regular expressions).
 *
 * @example
 * const currency = '$';
 * const prices = '$1;$10;$100';
 * const pricesInDollars = prices.match(re`${currency}\\d+/g`);
 *    // ^ `['$1', '$10', '$100']`
 */
declare const re: RegexBuilder;

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
 * Allows one to semantically check if a given number
 * falls within a range similarly to *Python* by utilizing
 * a `Proxy` and creating a trap for the `in` operator.
 *
 * @see {@link range} for normal range usage
 *
 * @example
 * if (score in Range(90, 100)) return 'A';
 */
declare const Range: (start?: number, stop?: number, step?: number, _incl?: boolean) => Readonly<Readonly<{}>>;
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
 * falls within an ***inclusive*** range similarly to *Python* by
 * utilizing a `Proxy` and creating a trap for the `in` operator.
 *
 * @see {@link irange} for normal irange usage
 *
 * @example
 * if (score in iRange(90, 100)) return 'A';
 */
declare const iRange: (start?: number, stop?: number, step?: number, _incl?: boolean) => Readonly<Readonly<{}>>;

export { Range as R, t as a, range as b, cdn as c, defined as d, iRange as e, irange as i, linesOf as l, re as r, sleep as s, trimLines as t };
