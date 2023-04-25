import { __name } from './chunk-HXRSFH6L.js';
import rfdc from 'rfdc/default';
import equal from 'deep-equal';
export { deepmerge, deepmergeCustom, deepmergeInto, deepmergeIntoCustom } from 'deepmerge-ts';

var deepclone = rfdc;
var deepcompare = /* @__PURE__ */ __name((a, b, { strict = true } = {}) => equal(a, b, { strict }), "deepcompare");

export { deepclone, deepcompare };
