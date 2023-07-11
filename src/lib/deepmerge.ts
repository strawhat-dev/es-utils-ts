import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts';

/** Custom version of `deepmerge` which ensures **unique** array items. */
export const deepmerge = deepmergeCustom({ mergeArrays: (arrays) => [...new Set(arrays.flat())] });

/** Custom version of `deepmergeInto` which ensures **unique** array items. */
export const deepmergeInto = deepmergeIntoCustom({
  mergeArrays(target, arrays, { defaultMergeFunctions: { mergeArrays } }) {
    mergeArrays(target, [...new Set(arrays.flat())] as []);
  },
});
