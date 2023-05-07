export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
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
declare const deepcopy: <T>(input: T) => T;
/**
 * *rfdc (Really Fast Deep Clone)*
 *
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
declare const deepclone: <T>(source: T) => T;
/**
 * *deep-equal* module w/ **strict on** by default
 *
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
declare const deepcompare: (a: unknown, b: unknown, options?: {
    strict: boolean;
}) => boolean;

export { deepclone, deepcompare, deepcopy };
