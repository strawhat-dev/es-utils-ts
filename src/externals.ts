/**
 * @overview - Other external "essential" utilities as named exports (tree-shakeable!).
 * Some may be a dependency for some internal utilities or have changed defaults.
 * Handpicked based on combination of performance, popularity, and update recency.
 * All credits goes to their respective authors.
 */

import type { JsObject, JsValue } from '@/types';

// @ts-ignore
import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepEqual from 'deep-equal';
import objectInspect from 'object-inspect';

export { default as escapeRegex } from 'escape-string-regexp';

export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
} from 'deepmerge-ts';

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
 * *object-inspect* -
 * String representations of objects in node.js and the browser. \
 * *Note: indentation defaults to `2` if not provided*
 * @see {@link https://www.npmjs.com/package/object-inspect}
 */
export const inspect = ((obj, opts = {}) => (
  (opts['indent'] ??= 2), objectInspect(obj, opts)
)) as typeof objectInspect;

/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
export const equal = ((...args: Parameters<typeof deepEqual>) => (
  args[2] ? (args[2]['strict'] ??= true) : (args[2] = { strict: true }),
  deepEqual(...args)
)) as {
  <A extends JsObject, B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A extends JsValue[], B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    }
  ): a is B;

  <A extends JsValue, B extends Readonly<A>>(
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
