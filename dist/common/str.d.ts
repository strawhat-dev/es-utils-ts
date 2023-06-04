import type { RegexBuilder, TaggedTemplate } from './types.js';
/**
 * @returns an array of *all* **non-empty** lines of the given string.
 */
export declare const linesOf: (s: string) => string[];
/**
 * @returns the *trimmed* string with **all** *empty* lines removed.
 */
export declare const trimLines: (s: string) => string;
/**
 * Tag function that rebuilds and returns the rebuilt string, but with each sub of
 * `subs` coerced and mapped to an *empty string* if `nullish` or `false` *(by default)*.
 * - Optionally the `subs` may be mapped with a callback instead, if the last arg
 * is a function *(i.e. the last interpolated item)*.
 */
export declare const t: TaggedTemplate;
/**
 * Like the `RegExp` constructor *(without usage of `new` keyword)* with the following enhancements:
 * - When invoked as a **tagged template**, any expression interpolated will be *escaped* for regex.
 * - Regular expression flags may still be provided when invoked as tag function by simply
 *   including the desired flags at the end (as with normal regular expressions).
 * - The `flags` argument may also optionally be provided as an {@link RegexOptions | options object}
 *   that maps to the corresponding flags (with typed completions + documentation) for better readability.
 *
 * @example
 * const currency = '$';
 * const prices = '$1;$10;$100';
 * const pricesInDollars = prices.match(re`${currency}\\d+/g`);
 *    // ^ `['$1', '$10', '$100']`
 */
export declare const re: RegexBuilder;
