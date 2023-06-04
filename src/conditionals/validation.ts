import type { Nullish, Union } from '../type-utils.js';

/**
 * Checks if a value is `nullish`, but **also considers `NaN`** *(because the
 * contexts in which one would consider `NaN` to be a valid condition to continue
 * would most likely be next to none)*.
 * @returns `true` if `value` is `NaN`, `null`, or `undefined`; `false` otherwise
 */
// prettier-ignore
export const nullish = (value: unknown): value is Nullish => typeof value === 'undefined' || value === null || Number.isNaN(value);

/**
 * Utilizes `URL` constructor to check if the provided string is a valid url.
 * - Set the `protocol` option to a `string` to check for a custom protocol,
 * or set the `protocol` option to `'any'` to allow **any** protocol. Otherwise,
 * defaults to checking if the url has a valid *http* protocol (i.e. `http:` or `https:`).
 */
// prettier-ignore
export const validURL = (value: unknown, options?: { protocol?: Union<'any'> }): value is URL & string => {
  try {
    const url = new URL(value as URL | string);
    const { protocol } = options ?? {};
    if (!protocol) return url.protocol === 'http:' || url.protocol === 'https:';
    return protocol === 'any' || protocol === url.protocol;
  } catch { return false; }
};
