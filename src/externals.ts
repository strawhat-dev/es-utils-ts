import equal from 'deep-equal';

export { default as deepclone } from 'rfdc/default';

export {
  deepmerge,
  deepmergeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
} from 'deepmerge-ts';

export const deepcompare = (
  a: unknown,
  b: unknown,
  { strict = true }: { strict?: boolean } = {}
) => equal(a, b, { strict });
