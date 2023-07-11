import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts';

// src/lib/deepmerge.ts
var deepmerge = deepmergeCustom({ mergeArrays: (arrays) => [...new Set(arrays.flat())] });
var deepmergeInto = deepmergeIntoCustom({
  mergeArrays(target, arrays, { defaultMergeFunctions: { mergeArrays } }) {
    mergeArrays(target, [...new Set(arrays.flat())]);
  }
});

export { deepmerge, deepmergeInto };
