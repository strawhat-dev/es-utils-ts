/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
// @ts-ignore
import clone from 'rfdc/default';
import rfdc from 'rfdc';
import deepequal from 'deep-equal';

export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
} from 'deepmerge-ts';

export { default as range } from 'just-range';

export { default as inspect } from 'object-inspect';

export { default as escapeRegex } from 'escape-string-regexp';

/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support
 *
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export const deepcopy = rfdc?.({ circles: true });

/**
 * *rfdc (Really Fast Deep Clone)*
 *
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export const deepclone = clone as <T>(source: T) => T;

/**
 * *deep-equal* module w/ **strict on** by default
 *
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
export const deepcompare = (
  a: unknown,
  b: unknown,
  options: { strict: boolean } = { strict: true }
) => deepequal(a, b, options);
