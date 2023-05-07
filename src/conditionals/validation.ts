import type { Nullish } from '@/types';

// prettier-ignore
/**
 * Similarly to nullish coalescing, checks if given `value` is `undefined` or `null`.
 * @returns `true` if `value` is `undefined` or `null`; `false` otherwise
 */
export const nullish = (value: unknown): value is Nullish => typeof value === 'undefined' || value === null;

// prettier-ignore
/**
 * An alternative to the *logical not* operator; checks if `value` is falsy ***(excluding `''` + `0`)***.
 * This is similar to nullish coalescing but with checks for `false` and `NaN` as well, for the common
 * use case of wanting to check if some value is *falsy/invalid*, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `undefined`, `null`, or `NaN`; `false` otherwise
 */
export const not = (value: unknown): value is false | Nullish => value === false || nullish(value) || Number.isNaN(value);

/**
 * Utilizes `URL` constructor (as opposed to regular expressions)
 * to check if the provided string is a valid url.
 *
 * Set the `http` option to `false` to allow any urls that are parsable by the `URL`
 * constructor (e.g. `"foo:bar"`), instead of just those with a valid "http/https" protocol.
 *
 * *(defaults to `true` since this is the most common desired behavior)*
 */
export const validURL = (
  value: string,
  options: { http: boolean } = { http: true }
) => {
  try {
    const { protocol } = new URL(value);
    return !options.http || protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};
