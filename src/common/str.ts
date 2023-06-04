import type { Fn } from '../type-utils.js';
import type { RegexBuilder, RegexOptions, TaggedTemplate } from './types.js';

import { defined } from './lib.js';
import { keys } from '../objects/index.js';
import { escapeRegex } from '../externals.js';
import { isTemplateStringsArray } from '../conditionals/index.js';

// https://stackoverflow.com/a/13546700
const RE_FLAG_PATTERN = /[/]\b(?!\w*(\w)\w*\1)[dgimsuy]+\b$/;

// developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags
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
 * @returns the *trimmed* string with **all** *empty* lines removed.
 */
export const trimLines = (s: string) => linesOf(s).join('\n').trim();

/**
 * Tag function that rebuilds and returns the rebuilt string, but with each sub of
 * `subs` coerced and mapped to an *empty string* if `nullish` or `false` *(by default)*.
 * - Optionally the `subs` may be mapped with a callback instead, if the last arg
 * is a function *(i.e. the last interpolated item)*.
 */
export const t: TaggedTemplate = (raw, ...subs) => {
  const cb = (typeof subs.at(-1) === 'function' ? subs.pop() : defined) as Fn;
  for (let i = 0; i < subs.length; ++i) subs[i] = cb(subs[i]);
  return String.raw({ raw }, ...subs);
};

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
export const re: RegexBuilder = (raw, ...subs) => {
  let [pattern, flags = ''] = [raw, subs[0]] as [string, string];
  if (isTemplateStringsArray(raw)) {
    subs.push(escapeRegex);
    pattern = t(raw, ...subs);
    flags = (pattern.match(RE_FLAG_PATTERN) || [''])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ''));
  } else if (typeof flags === 'object') {
    const opts = flags as RegexOptions;
    flags = '';
    for (const opt of keys(opts, { definedOnly: true })) {
      flags += RE_FLAG_OPTION[opt] ?? '';
    }
  }

  return new RegExp(pattern, flags);
};
