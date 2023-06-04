/**
 * @overview - Other external "essential" utilities that should really
 * be part of the standard library, as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Chosen based on combination of necessity, performance, popularity, and update recency.
 */
import type { JsObject, Value } from './type-utils.js';
import escapeStringRegexp from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
export declare const escapeRegex: typeof escapeStringRegexp;
/**
 * *rfdc (Really Fast Deep Clone)* w/ circular reference support \
 * Note: 25% additional performance overhead with circular reference support.
 * Use {@link deepclone} if the object is guaranteed to have no circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export declare const deepcopy: <T>(input: T) => T;
/**
 * *rfdc (Really Fast Deep Clone)* \
 * Note: Will **fail** if the object contains circular references.
 * Use {@link deepcopy} if the object can contain circular references.
 * @see {@link https://www.npmjs.com/package/rfdc}
 */
export declare const deepclone: <T>(input: T) => T;
/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
export declare const equal: {
    <A extends JsObject, B extends Readonly<A>>(a: Readonly<A>, b: Readonly<B>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B;
    <A_1 extends Value[], B_1 extends Readonly<A_1>>(a: Readonly<A_1>, b: Readonly<B_1>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_1;
    <A_2 extends Value, B_2 extends Readonly<A_2>>(a: Readonly<A_2>, b: Readonly<B_2>, options?: {
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
