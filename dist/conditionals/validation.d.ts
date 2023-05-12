import type { Nullish, Union } from '../types';
/**
 * Similarly to nullish coalescing, checks if given `value` is `undefined` or `null`.
 * @returns `true` if `value` is `undefined` or `null`; `false` otherwise
 */
export declare const nullish: (value: unknown) => value is Nullish;
/**
 * An alternative to the *logical not* operator; checks if `value` is falsy ***(excluding `''` + `0`)***.
 * This is similar to nullish coalescing but with checks for `false` and `NaN` as well, for the common
 * use case of wanting to check if some value is *falsy/invalid*, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `undefined`, `null`, or `NaN`; `false` otherwise
 */
export declare const not: (value: unknown) => value is false | Nullish;
/**
 * Utilizes `URL` constructor to check if the provided string is a valid url.
 * - Set the `protocol` option to a `string` to check for a custom protocol,
 * or set the `protocol` option to `'any'` to allow **any** protocol. Otherwise,
 * defaults to checking if the url has a valid *http* protocol (i.e. `http:` or `https:`).
 */
export declare const validURL: (value: unknown, options?: {
    protocol?: Union<'any'>;
}) => value is URL & string;
//# sourceMappingURL=validation.d.ts.map