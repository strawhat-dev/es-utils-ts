import { __name } from './chunk-HXRSFH6L.js';

// src/promises.ts
var sleep = /* @__PURE__ */ __name(async (ms) => {
  return new Promise((res) => setTimeout(res, +ms));
}, "sleep");
var cdn = /* @__PURE__ */ __name(async (name) => {
  const mod = await import(`https://esm.run/${name}`);
  return mod?.default || mod;
}, "cdn");

export { cdn, sleep };
