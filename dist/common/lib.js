import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';
import { normalize } from '../path/index.js';
import { nullish } from '../conditionals/index.js';
/**
 * Coerces the given `value` to an **empty string** *(by default)*
 * if it is `false`, `undefined`, `null`, or `NaN`, otherwise
 * returns the `value` as is. Useful in short-circuit evaluation
 * or initialization where you would need to check if the value is
 * falsy **(except `''` & `0`)**, while returning a default
 * fallback value instead as opposed to a `boolean`.
 */
// prettier-ignore
export const defined = (value, { fallback = '' } = { fallback: '' }) => (value === false || nullish(value) ? fallback : value);
// prettier-ignore
export const browser = () => (typeof globalThis['window']?.document !== 'undefined' &&
    globalThis['navigator']);
// prettier-ignore
export const ismain = ({ url }) => {
    try {
        const name = normalize(fileURLToPath(url));
        const main = normalize(realpathSync(process.argv[1]));
        return name === main;
    }
    catch {
        return false;
    }
};
