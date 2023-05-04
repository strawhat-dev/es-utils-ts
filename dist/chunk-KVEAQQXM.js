import { __name } from './chunk-HXRSFH6L.js';

// src/conditionals/validation.ts
var nullish = /* @__PURE__ */ __name((value) => typeof value === "undefined" || value === null, "nullish");
var not = /* @__PURE__ */ __name((value) => nullish(value) || Number.isNaN(value) || value === false, "not");
var validURL = /* @__PURE__ */ __name((value, { http = true } = {}) => {
  try {
    const { protocol } = new URL(value);
    return !http || protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}, "validURL");

export { not, nullish, validURL };
