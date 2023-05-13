import type { Fn, Nullish } from '../type-utils';
import type { RegexBuilder, RegexOptions, TaggedTemplate } from './types';

import { keys } from '../objects';
import { isObject } from '../conditionals';
import { escapeRegex } from '../externals';

const RE_FLAG = Object.freeze({
  indices: 'd',
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  dotAll: 's',
  unicode: 'u',
  sticky: 'y',
});

/**
 * Coerces the given `value` to an **empty string** if it is `false`, `undefined`, `null`, or `NaN`,
 * otherwise returns the `value` as is. Useful in short-circuit evaluation or initialization where
 * you would need to check if the value is falsy **(except `0`)**, while returning `''` instead
 * *(which would also be falsy)*, as opposed to a `boolean`.
 */
// prettier-ignore
export const defined = <T>(value: T) => (
  (value || value === 0 ? value : '') as T extends Nullish | false
    ? ''
    : NonNullable<T>
);

/**
 * @returns an array of *all* **non-empty** lines of the given string.
 */
// prettier-ignore
export const lines = (s: string) => s.split(/\r?\n/).filter((line) => line.trim());

/**
 * @returns the *trimmed* string with *all* **empty** lines removed.
 */
export const trimLines = (s: string) => lines(s).join('\n');

/**
 * Tag function that rebuilds and returns the rebuilt string, but with each sub of
 * `subs` coerced and mapped to an *empty string* if `nullish` or `false` *(by default)*. \
 * Optionally a callback may be provided, in which the `subs` may be customly mapped instead.
 */
export const t: TaggedTemplate = (raw, ...subs) => {
  let mapper = defined;
  typeof subs.at(-1) === 'function' && (mapper = subs.pop() as Fn);
  return String.raw({ raw }, ...subs.map((s) => mapper(s)));
};

/**
 * Like the `RegExp` constructor with the following enhancements:
 * - When invoked as a **tagged template**, any expression interpolated will be *escaped* for regex.
 * - The `flags` argument may also optionally be provided as an {@link RegexOptions | options object}
 *   that maps to the corresponding flags, with typed completions, for better readability.
 * - Regular expression flags may still be provided when invoked as tag function by simply adding
 *   the desired flags as how you would normally for regular expressions, at the end.
 *
 * @example
 * const currency = '$';
 * const prices = '$1;$10;$100';
 * const pricesInDollars = prices.match(re`${currency}\\d+/g`);
 *    // ^ `['$1', '$10', '$100']`
 */
export const re: RegexBuilder = (raw, ...subs) => {
  let [pattern, flags = ''] = [raw, subs[0]];
  if (Array.isArray(pattern) && 'raw' in pattern) {
    subs.push(escapeRegex);
    pattern = t(raw as TemplateStringsArray, ...subs);
    flags = (pattern.match(/[/][dgimsuy]{1,7}$/) || [''])[0].slice(1);
    flags && (pattern = pattern.replace(new RegExp(`[/]${flags}$`), ''));
  } else if (isObject(flags)) {
    const options = flags as RegexOptions;
    flags = '';
    for (const opt of keys(options)) flags += RE_FLAG[opt];
  }

  return new RegExp(pattern as string, flags as string);
};
