import { deepmergeCustom, deepmergeIntoCustom } from 'deepmerge-ts';

// src/lib/deepmerge.ts
var isobject = (value) => value === Object(value);
var deepmerge = deepmergeCustom({
  mergeArrays: (arrays) => [...new Set(arrays.flat())],
  mergeOthers: (others) => others.filter(isobject)
});
var deepmergeInto = deepmergeIntoCustom({
  mergeArrays(target, arrays, { defaultMergeFunctions: { mergeArrays } }) {
    mergeArrays(target, [...new Set(arrays.flat())]);
  },
  mergeOthers(target, others, { defaultMergeFunctions: { mergeOthers } }) {
    mergeOthers(target, others.filter(isobject));
  }
});

export { deepmerge, deepmergeInto };
