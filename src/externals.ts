/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import rfdc from 'rfdc/default';
import equal from 'deep-equal';

export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
} from 'deepmerge-ts';

export { default as range } from 'just-range';

export { default as inspect } from 'object-inspect';

export { default as escapeRegex } from 'escape-string-regexp';

export const deepclone = rfdc as <T>(source: T) => T;

export const deepcompare = (
  a: unknown,
  b: unknown,
  { strict = true }: { strict?: boolean } = {}
) => equal(a, b, { strict });
