import type { Primitive } from 'type-fest';
import type { Fn, KeyOf } from '../type-utils.js';

import escapeStringRegexp from 'escape-string-regexp';
import { isTemplateStringsArray, nullishOrFalse } from '../conditionals/index.js';

// https://stackoverflow.com/a/13546700
const RE_FLAG_PATTERN = /[/]\b(?!\w*(\w)\w*\1)[dgimsuy]+\b$/;

// developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags
const RE_FLAG_OPTION = {
  indices: 'd',
  global: 'g',
  ignoreCase: 'i',
  multiline: 'm',
  dotAll: 's',
  unicode: 'u',
  sticky: 'y',
} as const;

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
 * - Optionally the `subs` may be mapped with a callback instead, if the last arg is a function
 *   *(i.e. the last interpolated item)*.
 */
export const t: TaggedTemplate = (raw, ...subs) => {
  const map = (
    typeof subs.at(-1) === 'function' ? subs.pop() : (sub) => (nullishOrFalse(sub) ? '' : sub)
  ) as Fn;

  for (let i = 0; i < subs.length; ++i) subs[i] = map(subs[i]);

  return String.raw({ raw }, ...subs);
};

type TaggedTemplate = <T>(
  raw: TemplateStringsArray,
  ...subs: T[] | [...T[], (sub: T) => unknown]
) => string;

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
export const re: RegexBuilder = (...args) => {
  let [pattern, flags = ''] = args as [string, string];
  if (isTemplateStringsArray(pattern)) {
    pattern = t(...(args as [TemplateStringsArray]), (sub: Primitive) =>
      escapeStringRegexp((sub ?? '').toString()),
    );

    flags = (pattern.match(RE_FLAG_PATTERN) || [''])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ''));
  } else if (typeof flags === 'object') {
    flags = '';
    for (const opt in flags as RegexOptions) {
      flags += RE_FLAG_OPTION[opt as KeyOf<RegexOptions>] ?? '';
    }
  }

  return new RegExp(pattern, flags);
};

type RegexBuilder = {
  (pattern: string | RegExp, flags?: string | RegexOptions): RegExp;
  (raw: TemplateStringsArray, ...subs: unknown[]): RegExp;
};

type RegexOptions = {
  /**
   * `[ d flag ]` *Generate indices for substring matches.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/hasIndices}
   */
  indices?: boolean;
  /**
   * `[ g flag ]` *Global search.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global}
   */
  global?: boolean;
  /**
   * `[ i flag ]` *Case-insensitive search.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase}
   */
  ignoreCase?: boolean;
  /**
   * `[ m flag ]` *Allows `^` and `$` to match newline characters.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline}
   */
  multiline?: boolean;
  /**
   * `[ s flag ]` *Allows `.` to match newline characters.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll}
   */
  dotAll?: boolean;
  /**
   * `[ u flag ]` *Unicode - treat a pattern as a sequence of Unicode code points.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode}
   */
  unicode?: boolean;
  /**
   * `[ y flag ]` *Perform a "sticky" search that matches starting at the current position in the target string.*
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
   */
  sticky?: boolean;
};
