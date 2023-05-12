/**
 * Similarly to nullish coalescing, checks if given `value` is `undefined` or `null`.
 * @returns `true` if `value` is `undefined` or `null`; `false` otherwise
 */
// prettier-ignore
export const nullish = (value) => typeof value === 'undefined' || value === null;
/**
 * An alternative to the *logical not* operator; checks if `value` is falsy ***(excluding `''` + `0`)***.
 * This is similar to nullish coalescing but with checks for `false` and `NaN` as well, for the common
 * use case of wanting to check if some value is *falsy/invalid*, but would consider *empty strings* or
 * the *number zero* to be *valid*, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `undefined`, `null`, or `NaN`; `false` otherwise
 */
// prettier-ignore
export const not = (value) => value === false || nullish(value) || Number.isNaN(value);
/**
 * Utilizes `URL` constructor to check if the provided string is a valid url.
 * - Set the `protocol` option to a `string` to check for a custom protocol,
 * or set the `protocol` option to `'any'` to allow **any** protocol. Otherwise,
 * defaults to checking if the url has a valid *http* protocol (i.e. `http:` or `https:`).
 */
// prettier-ignore
export const validURL = (value, options) => {
    try {
        const url = new URL(value);
        const { protocol } = options || {};
        if (!protocol)
            return url.protocol === 'http:' || url.protocol === 'https:';
        return protocol === 'any' || protocol === url.protocol;
    }
    catch {
        return false;
    }
};
