import { p as primitive, e as JsObject, b as Nullish } from './types-3dcf6e43.js';

/**
 * @returns `true` if `value` is a primitive (any non-object value), `false` otherwise
 */
declare const isprimitive: (value: unknown) => value is primitive;
/**
 * Used to cover common use case of checking if a value is just a
 * plain js object, whereas doing something like `typeof value === 'object'`
 * would also return `true` for arrays and even `null` for example.
 * @returns `true` if `value` is a plain js object, `false` otherwise
 */
declare const isobject: (value: unknown) => value is JsObject;
/**
 * Similarly to nullish coalescing, checks if given `value` is `null` or `undefined`
 * @returns `true` if `value` is `null` or `undefined`, `false` otherwise
 */
declare const nullish: (value: unknown) => value is Nullish;
/**
 * Checks if `value` is falsy *(excluding `''` + `0`)*. In some cases, one may want to check
 * if some value is falsy/invalid, but would consider empty strings or the number zero to
 * be valid data, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `NaN`, `null` or `undefined`, `false` otherwise
 */
declare const not: (value: unknown) => value is false | Nullish;

export { isobject, isprimitive, not, nullish };
