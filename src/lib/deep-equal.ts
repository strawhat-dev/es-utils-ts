import type { JsObject, Value } from '../type-utils.js';

import deepEqual from 'deep-equal';

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
    },
  ): a is B;

  <A extends Value[], B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    },
  ): a is B;

  <A extends Value, B extends Readonly<A>>(
    a: Readonly<A>,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    },
  ): a is B;

  <A, B extends Readonly<A>>(
    a: A,
    b: Readonly<B>,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    },
  ): a is B;

  <A extends B, B>(
    a: A,
    b: B,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    },
  ): b is A;

  (
    a: unknown,
    b: unknown,
    options?: {
      /** @defaultValue `true` */
      strict: boolean;
    },
  ): boolean;
};
