import { __name } from './chunk-HXRSFH6L.js';
import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepequal from 'deep-equal';
export { default } from 'object-inspect';
export { default as default2 } from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

var deepclone = rfdc;
var deepcopy = Rfdc?.({ circles: true });
var deepcompare = /* @__PURE__ */ __name((a, b, options = { strict: true }) => deepequal(a, b, options), "deepcompare");

export { deepclone, deepcompare, deepcopy };
