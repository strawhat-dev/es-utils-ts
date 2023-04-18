import { p as primitive, f as JsObject, d as Nullish, e as NullishFalse } from './types-1a12439f.js';

/**
 * @returns `true` if `value` is a primitive (any non-object value),
 * `false` otherwise
 */
declare const isprimitive: (value: unknown) => value is primitive;
/**
 * Used to cover common use case of checking if a value
 * is just a plain js object, whereas doing something like
 * `typeof value === 'object'` would also return `true` for
 * arrays and even `null` for example.
 * @returns `true` if `value` is a plain js object,
 * `false` otherwise
 */
declare const isobject: (value: unknown) => value is JsObject;
/**
 * Similarly to nullish coalescing, checks if given `value` is "nullish",
 * whereas doing something like `!value` would also return `true` for
 * empty strings and the number zero.
 * @returns `true` if `value` is `null` or `undefined`,
 * `false` otherwise
 */
declare const nullish: (value: unknown) => value is Nullish;
/**
 * Similar to {@link nullish}, but with added check for `false`. May be
 * used to check if `value` is "falsey" but without including values
 * like empty strings or zeroes (in which simply `!value` would do if
 * if this behavior was desired).
 * @returns `true` if `value` is `false` or `null` or `undefined`,
 * `false` otherwise
 */
declare const nullishFalse: (value: unknown) => value is NullishFalse;

export { isobject, isprimitive, nullish, nullishFalse };
