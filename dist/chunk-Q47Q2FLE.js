import rfdc from 'rfdc/default';
import Rfdc from 'rfdc';
import deepEqual from 'deep-equal';
import objectInspect from 'object-inspect';
export { default } from 'escape-string-regexp';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var deepcopy = Rfdc?.({ circles: true });
var deepclone = rfdc;
var inspect = /* @__PURE__ */ __name((obj, opts = {}) => (opts["indent"] ??= 2, objectInspect(obj, opts)), "inspect");
var equal = /* @__PURE__ */ __name((...args) => (args[2] ? args[2]["strict"] ??= true : args[2] = { strict: true }, deepEqual(...args)), "equal");

export { __name, deepclone, deepcopy, equal, inspect };
