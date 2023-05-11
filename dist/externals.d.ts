import { JsObject, JsValue } from './types.js';
import objectInspect from 'object-inspect';
export { default as escapeRegex } from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
import './conditional-except.d-c99547cb.js';
import './writable.js';
import 'type-fest/source/async-return-type.js';
import 'type-fest/source/merge-deep.js';

/**
 * @overview - Other external "essential" utilities as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Handpicked based on combination of performance, popularity, and update recency.
 * All credits goes to their respective authors.
 */

/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support \
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
declare const deepcopy: <T>(input: T) => T;
/**
 * *rfdc (Really Fast Deep Clone)* \
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
declare const deepclone: <T>(input: T) => T;
/**
 * *object-inspect* -
 * String representations of objects in node.js and the browser. \
 * *Note: indentation defaults to `2` if not provided*
 * @see {@link https://www.npmjs.com/package/object-inspect}
 */
declare const inspect: typeof objectInspect;
/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
declare const equal: {
    <A extends JsObject, B extends Readonly<A>>(a: Readonly<A>, b: Readonly<B>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B;
    <A_1 extends JsValue[], B_1 extends Readonly<A_1>>(a: Readonly<A_1>, b: Readonly<B_1>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_1;
    <A_2 extends JsValue, B_2 extends Readonly<A_2>>(a: Readonly<A_2>, b: Readonly<B_2>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_2;
    <A_3, B_3 extends Readonly<A_3>>(a: A_3, b: Readonly<B_3>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_3;
    <A_4 extends B_4, B_4>(a: A_4, b: B_4, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): b is A_4;
    (a: unknown, b: unknown, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): boolean;
};

export { deepclone, deepcopy, equal, inspect };
