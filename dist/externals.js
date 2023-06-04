/**
 * @overview - Other external "essential" utilities that should really
 * be part of the standard library, as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Chosen based on combination of necessity, performance, popularity, and update recency.
 */
// @ts-ignore
import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepEqual from 'deep-equal';
import escapeStringRegexp from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
// prettier-ignore
export const escapeRegex = ((s) => escapeStringRegexp((s ?? '').toString()));
/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support \
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
export const deepcopy = Rfdc?.({ circles: true });
/**
 * *rfdc (Really Fast Deep Clone)* \
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export const deepclone = rfdc;
/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
export const equal = ((...args) => {
    var _a;
    return (args[2] ? ((_a = args[2])['strict'] ?? (_a['strict'] = true)) : (args[2] = { strict: true }), deepEqual(...args));
});
