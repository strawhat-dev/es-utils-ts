import { __name } from './chunk-HXRSFH6L.js';

// src/promises.ts
var ESM_CDN_URL = "https://esm.run";
var sleep = /* @__PURE__ */ __name(async (ms) => new Promise((res) => setTimeout(res, +ms)), "sleep");
var cdn = /* @__PURE__ */ __name(async (name) => {
  const mod = await import(`${ESM_CDN_URL}/${name}`);
  return mod?.default || mod;
}, "cdn");

export { cdn, sleep };
