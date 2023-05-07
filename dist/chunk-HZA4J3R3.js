import { __name } from './chunk-HXRSFH6L.js';

// src/conditionals/validation.ts
var nullish = /* @__PURE__ */ __name((value) => typeof value === "undefined" || value === null, "nullish");
var not = /* @__PURE__ */ __name((value) => value === false || nullish(value) || Number.isNaN(value), "not");
var validURL = /* @__PURE__ */ __name((value, options = { http: true }) => {
  try {
    const { protocol } = new URL(value);
    return !options.http || protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}, "validURL");

export { not, nullish, validURL };
