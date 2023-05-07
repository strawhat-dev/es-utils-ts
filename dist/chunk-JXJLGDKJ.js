import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepEqual from 'deep-equal';
import objectInspect from 'object-inspect';
export { default } from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var deepclone = rfdc;
var deepcopy = Rfdc?.({ circles: true });
var deepcompare = /* @__PURE__ */ __name((a, b, options = { strict: true }) => deepEqual(a, b, options), "deepcompare");
var inspect = /* @__PURE__ */ __name((value, opts = { indent: 2 }) => objectInspect(value, opts), "inspect");

export { __name, deepclone, deepcompare, deepcopy, inspect };
