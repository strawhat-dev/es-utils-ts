import { __name } from './chunk-HXRSFH6L.js';
import clone from 'rfdc/default';
import rfdc from 'rfdc';
import deepequal from 'deep-equal';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';
export { default } from 'just-range';
export { default as default2 } from 'object-inspect';
export { default as default3 } from 'escape-string-regexp';

var deepcopy = rfdc?.({ circles: true });
var deepclone = clone;
var deepcompare = /* @__PURE__ */ __name((a, b, options = { strict: true }) => deepequal(a, b, options), "deepcompare");

export { deepclone, deepcompare, deepcopy };
