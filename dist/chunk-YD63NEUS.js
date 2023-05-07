import { pop } from './chunk-C5SFKOQO.js';
import { trimLines } from './chunk-DDDNNU76.js';
import { isObject } from './chunk-7U7BT2PX.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/browser/index.ts
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
  newtab && (newtab = { target: "_blank", rel: "noreferrer noopener" });
  return createElement("a", { href, textContent, ...newtab }, document);
}, "createLink");
var createHTMLDoc = /* @__PURE__ */ __name((body = "", { head = "" } = {}) => trimLines(
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