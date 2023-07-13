import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts';

/**
 * Custom version of `deepmerge` which ensures **unique** array items,
 * while also filtering out and ignoring non-objects from the merge.
 */
export const deepmerge = deepmergeCustom({
  mergeArrays: (arrays) => [...new Set(arrays.flat())],
  mergeOthers(others, { defaultMergeFunctions: { mergeOthers } }, meta) {
    meta || (others as unknown as []).pop();
    return mergeOthers(others);
  },
});

/**
 * Custom version of `deepmergeInto` which ensures **unique** array items,
 * while also filtering out and ignoring non-objects from the merge.
 */
export const deepmergeInto = deepmergeIntoCustom({
  mergeArrays(target, arrays, { defaultMergeFunctions: { mergeArrays } }) {
    mergeArrays(target, [...new Set(arrays.flat())] as []);
  },
  mergeOthers(target, others, { defaultMergeFunctions: { mergeOthers } }, meta) {
    meta || (others as unknown as []).pop();
    mergeOthers(target, others);
  },
});
