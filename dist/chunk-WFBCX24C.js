import { __name } from './chunk-HXRSFH6L.js';

// src/browser/index.ts
var querySelectorMatchAll = /* @__PURE__ */ __name((regex, selectors = "*", document = globalThis["document"]) => {
  const result = [];
  for (const el of document.querySelectorAll(selectors)) {
    regex.test(el.textContent) && result.push(el);
  }
  return result;
}, "querySelectorMatchAll");
var createElement = /* @__PURE__ */ __name((tag, properties, document = globalThis["document"]) => Object.assign(document.createElement(tag), properties), "createElement");
var createLink = /* @__PURE__ */ __name((href, options = {}, document = globalThis["document"]) => {
  let { newtab, textContent = href } = { ...options };
  newtab && (newtab = { target: "_blank", rel: "noreferrer noopener" });
  return createElement("a", { href, textContent, ...newtab }, document);
}, "createLink");

export { createElement, createLink, querySelectorMatchAll };
