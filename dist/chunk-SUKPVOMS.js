import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts';

// src/lib/deepmerge.ts
var deepmerge = deepmergeCustom({
  mergeArrays: (arrays) => [...new Set(arrays.flat())],
  mergeOthers(others, { defaultMergeFunctions: { mergeOthers } }, meta) {
    meta || others.pop();
    return mergeOthers(others);
  }
});
var deepmergeInto = deepmergeIntoCustom({
  mergeArrays(target, arrays, { defaultMergeFunctions: { mergeArrays } }) {
    mergeArrays(target, [...new Set(arrays.flat())]);
  },
  mergeOthers(target, others, { defaultMergeFunctions: { mergeOthers } }, meta) {
    meta || others.pop();
    mergeOthers(target, others);
  }
});

export { deepmerge, deepmergeInto };
