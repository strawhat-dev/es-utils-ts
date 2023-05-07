import { Options } from 'object-inspect';
export { default as escapeRegex } from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

/**
 * @overview - Other external "essential" utilities as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Handpicked based on combination of performance, popularity, and update recency.
 * All credits goes to their respective authors.
 */

/**
 * *rfdc (Really Fast Deep Clone)* \
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
declare const deepclone: <T>(input: T) => T;
/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support \
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
declare const deepcopy: <T>(input: T) => T;
/**
 * *deep-equal* module w/ **strict on** by default \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
declare const deepcompare: (a: unknown, b: unknown, options?: {
    strict: boolean;
}) => boolean;
/**
 * *object-inspect* - String representations of objects in node and the browser. \
 * *Note: indentation defaults to `2` if no options are provided*
 * @see {@link https://www.npmjs.com/package/object-inspect}
 */
declare const inspect: (value: unknown, opts?: Options) => string;

export { deepclone, deepcompare, deepcopy, inspect };
