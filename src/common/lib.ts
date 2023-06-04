/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Nullish, Value } from '../type-utils.js';

import { nullish } from '../conditionals/index.js';

/**
 * Coerces the given `value` to an **empty string** *(by default)*
 * if it is `false`, `undefined`, `null`, or `NaN`, otherwise
 * returns the `value` as is. Useful in short-circuit evaluation
 * or initialization where you would need to check if the value is
 * falsy **(except `''` & `0`)**, while returning a default
 * fallback value instead as opposed to a `boolean`.
 */
// prettier-ignore
export const defined = <
  T,
  Options extends { fallback: Value } = { fallback: '' }
>(value: T, { fallback = '' } = { fallback: '' } as Readonly<Options>) => (
  (value === false || nullish(value) ? fallback : value) as T extends Nullish | false
    ? Options['fallback']
    : NonNullable<T>
);

// prettier-ignore
export const browser = () => (
  typeof globalThis['window']?.document !== 'undefined' &&
  globalThis['navigator']
);
