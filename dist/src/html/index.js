import { pop } from '../objects';
import { trimLines } from '../lib';
import { isObject } from '../conditionals';
/**
 * Like `querySelectorAll`, but returns an array of elements where
 * the `textContent` matches the regex provided as the first argument.
 * Selectors may still be optionally passed as the second argument.
 * *(defaults to `"*"` otherwise)*
 *
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 */
export const querySelectorMatchAll = (regex, selectors = '*', document = globalThis['document']) => {
    const result = [];
    for (const el of document.querySelectorAll(selectors)) {
        regex.test(el.textContent) && result.push(el);
    }
    return result;
};
/**
 * Convenience wrapper for `document.create` which allows for the
 * more semantic assignment of properties from the second argument,
 * along with typed completions.
 *
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns some `HTMLElement` created from the given `tag` & `properties`
 */
// prettier-ignore
export const createElement = (tag, properties, document = globalThis['document']) => {
    const el = document.createElement(tag);
    const style = isObject(properties?.['style']) && pop(properties, 'style');
    Object.assign(el, properties);
    Object.assign(el.style, style);
    return el;
};
/**
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns an `HTMLAnchorElement` created from the given `href` & `options`
 */
export const createLink = (href, options = {}, document = globalThis['document']) => {
    let { newtab, textContent = href } = { ...options };
    newtab &&= { target: '_blank', rel: 'noreferrer noopener' };
    return createElement('a', { href, textContent, ...newtab }, document);
};
/**
 * Generates an html string using the everyday
 * boilerplate code most html templates should have already.
 * Body and header contents may also optionally be inserted if provided.
 */
// prettier-ignore
export const createHTMLDoc = ({ head = '', body = '' } = {}) => trimLines(/* html */ `
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
`);
