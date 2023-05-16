import type { Fn, Nullish } from '../type-utils';
import type { RegexBuilder, RegexOptions, TaggedTemplate } from './types';

import { keys } from '../objects';
import { escapeRegex } from '../externals';
import { isTemplateStringsArray } from '../conditionals';

// https://stackoverflow.com/a/13546700
const RE_FLAG_PATTERN = /[/]\b(?!\w*(\w)\w*\1)[dgimsuy]+\b$/;

const RE_FLAG_OPTION = Object.freeze({
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
export const linesOf = (s: string) => {
  const ret = [];
  const lines = s.split(/\r?\n/);
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    line.trim() && ret.push(line);
  }

  return ret;
};

/**
 * @returns the *trimmed* string with *all* **empty** lines removed.
 */
export const trimLines = (s: string) => linesOf(s).join('\n').trim();

/**
 * Tag function that rebuilds and returns the rebuilt string, but with each sub of
 * `subs` coerced and mapped to an *empty string* if `nullish` or `false` *(by default)*. \
 * Optionally a callback may be provided, in which the `subs` may be customly mapped instead.
 */
export const t: TaggedTemplate = (raw, ...subs) => {
  let callback = defined;
  typeof subs.at(-1) === 'function' && (callback = subs.pop() as Fn);
  for (let i = 0; i < subs.length; ++i) subs[i] = callback(subs[i]) as never;
  return String.raw({ raw }, ...subs);
};

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
export const re: RegexBuilder = (raw, ...subs) => {
  let [pattern, flags = ''] = [raw, subs[0]];
  if (isTemplateStringsArray(raw)) {
    subs.push(escapeRegex);
    pattern = t(raw, ...subs);
    flags = (pattern.match(RE_FLAG_PATTERN) || [''])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ''));
  } else if (typeof flags === 'object') {
    const opts = flags as RegexOptions;
    flags = '';
    for (const opt of keys(opts, { defined: true })) {
      flags += RE_FLAG_OPTION[opt] ?? '';
    }
  }

  return new RegExp(pattern as string, flags as string);
};
