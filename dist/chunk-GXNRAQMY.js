import { trimLines } from './chunk-MEICBSKU.js';
import { pop } from './chunk-322U5OCO.js';
import { isObject } from './chunk-BPNVOCZU.js';
import { __name } from './chunk-Q47Q2FLE.js';

// src/html/index.ts
var querySelectorMatchAll = /* @__PURE__ */ __name((regex, selectors = "*", document = globalThis["document"]) => {
  const result = [];
  for (const el of document.querySelectorAll(selectors)) {
    regex.test(el.textContent) && result.push(el);
  }
  return result;
}, "querySelectorMatchAll");
var createElement = /* @__PURE__ */ __name((tag, properties, document = globalThis["document"]) => {
  const el = document.createElement(tag);
  const style = isObject(properties?.["style"]) && pop(properties, "style");
  Object.assign(el, properties);
  Object.assign(el.style, style);
  return el;
}, "createElement");
var createLink = /* @__PURE__ */ __name((href, options = {}, document = globalThis["document"]) => {
  let { newtab, textContent = href } = { ...options };
  newtab &&= { target: "_blank", rel: "noreferrer noopener" };
  return createElement("a", { href, textContent, ...newtab }, document);
}, "createLink");
var createHTMLDoc = /* @__PURE__ */ __name(({ head = "", body = "" } = {}) => trimLines(
  /* html */
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`
), "createHTMLDoc");

export { createElement, createHTMLDoc, createLink, querySelectorMatchAll };