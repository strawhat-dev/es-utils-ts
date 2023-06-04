import type { Nullish, Value } from '../type-utils.js';
/**
 * Coerces the given `value` to an **empty string** *(by default)*
 * if it is `false`, `undefined`, `null`, or `NaN`, otherwise
 * returns the `value` as is. Useful in short-circuit evaluation
 * or initialization where you would need to check if the value is
 * falsy **(except `''` & `0`)**, while returning a default
 * fallback value instead as opposed to a `boolean`.
 */
export declare const defined: <T, Options extends {
    fallback: Value;
} = {
    fallback: '';
}>(value: T, { fallback }?: Readonly<Options>) => T extends false | Nullish ? Options["fallback"] : NonNullable<T>;
export declare const browser: () => false | Navigator;
