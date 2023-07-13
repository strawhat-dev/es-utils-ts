import { trimLines } from './chunk-LIVVYGBL.js';
import { pop } from './chunk-MJH5C2IG.js';

// src/html/index.ts
var querySelectorMatchAll = (regex, selectors = "*", document = globalThis["document"]) => {
  const result = [];
  for (const el of document.querySelectorAll(selectors)) {
    regex.test(el.textContent) && result.push(el);
  }
  return result;
};
var createElement = (tag, props = {}, document = globalThis["document"]) => {
  const el = document.createElement(tag);
  const style = typeof props["style"] === "object" && pop(props, "style");
  Object.assign(el, props);
  Object.assign(el.style, style);
  return el;
};
var createLink = (href, options = {}, document = globalThis["document"]) => {
  let { newtab, textContent = href } = { ...options };
  newtab &&= { target: "_blank", rel: "noreferrer noopener" };
  return createElement("a", { href, textContent, ...newtab }, document);
};
var createHTMLDoc = ({ head = "", body = "" } = {}) => trimLines(
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
);

export { createElement, createHTMLDoc, createLink, querySelectorMatchAll };
