/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
// @ts-ignore
import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepequal from 'deep-equal';

export { default as inspect } from 'object-inspect';

export { default as escapeRegex } from 'escape-string-regexp';

export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
} from 'deepmerge-ts';

/**
 * *rfdc (Really Fast Deep Clone)*
 *
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export const deepclone = rfdc as <T>(input: T) => T;

/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support
 *
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export const deepcopy = Rfdc?.({ circles: true });

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
