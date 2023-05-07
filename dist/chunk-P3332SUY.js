import { __name } from './chunk-HXRSFH6L.js';

// src/lib.ts
var trimLines = /* @__PURE__ */ __name((s) => s.split(/\r?\n/).filter((line) => line.trim()).join("\n"), "trimLines");
var add = /* @__PURE__ */ __name((a, b) => a + b, "add");
var sub = /* @__PURE__ */ __name((a, b) => a - b, "sub");
var mult = /* @__PURE__ */ __name((a, b) => a * b, "mult");
var div = /* @__PURE__ */ __name((a, b) => a / b, "div");
var mod = /* @__PURE__ */ __name((a, b) => a % b, "mod");
var lt = /* @__PURE__ */ __name((a, b) => a < b, "lt");
var gt = /* @__PURE__ */ __name((a, b) => a > b, "gt");
var lte = /* @__PURE__ */ __name((a, b) => a <= b, "lte");
var gte = /* @__PURE__ */ __name((a, b) => a >= b, "gte");

export { add, div, gt, gte, lt, lte, mod, mult, sub, trimLines };
