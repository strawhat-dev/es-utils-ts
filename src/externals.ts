/**
 * @overview - Other external "essential" utilities that should really
 * be part of the standard library, as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Chosen based on combination of necessity, performance, popularity, and update recency.
 */

import type { JsObject, Value } from './type-utils.js';

// @ts-ignore
import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepEqual from 'deep-equal';
import escapeStringRegexp from 'escape-string-regexp';

export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

// prettier-ignore
export const escapeRegex = ((s) =>
  escapeStringRegexp((s ?? '').toString())
) as typeof escapeStringRegexp;

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
export const deepclone = rfdc as typeof deepcopy;

/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
export const equal = ((...args: Parameters<typeof deepEqual>) => (
  args[2] ? (args[2]['strict'] ??= true) : (args[2] = { strict: true }), deepEqual(...args)
)) as {
  <A extends JsObject, B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A extends Value[], B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A extends Value, B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A, B extends Readonly<A>>(
    a: A,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A extends B, B>(
    a: A,
    b: B,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): b is A;

  (
    a: unknown,
    b: unknown,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): boolean;
};
