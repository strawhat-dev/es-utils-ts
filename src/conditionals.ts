import type { JsObject, Nullish, primitive } from '@/types';

/**
 * @returns `true` if `value` is a primitive (any non-object value), `false` otherwise
 */
export const isprimitive = (value: unknown): value is primitive => {
  return value !== Object(value);
};

/**
 * Used to cover common use case of checking if a value is just a
 * plain js object, whereas doing something like `typeof value === 'object'`
 * would also return `true` for arrays and even `null` for example.
 * @returns `true` if `value` is a plain js object, `false` otherwise
 */
export const isobject = (value: unknown): value is JsObject => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

/**
 * Similarly to nullish coalescing, checks if given `value` is `null` or `undefined`
 * @returns `true` if `value` is `null` or `undefined`, `false` otherwise
 */
export const nullish = (value: unknown): value is Nullish => {
  return typeof value === 'undefined' || value === null;
};

/**
 * Checks if `value` is falsy *(excluding `''` + `0`)*. In some cases, one may want to check
 * if some value is falsy/invalid, but would consider empty strings or the number zero to
 * be valid data, whereas simply using the logical not operator (e.g. `!value`) would not.
 * @returns `true` if `value` is `false`, `NaN`, `null` or `undefined`, `false` otherwise
 */
export const not = (value: unknown): value is Nullish | false => {
  return nullish(value) || Number.isNaN(value) || value === false;
};
