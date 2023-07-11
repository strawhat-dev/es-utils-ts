import * as type_fest_source_except_js from 'type-fest/source/except.js';
import * as type_fest from 'type-fest';
import { PartialDeep } from 'type-fest';

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
declare const querySelectorMatchAll: (regex: RegExp, selectors?: string, document?: Document) => Element[];
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
declare const createElement: <T extends keyof HTMLElementTagNameMap>(tag: T, props?: PartialDeep<HTMLElementTagNameMap[T] extends infer T_1 ? { [KeyType_1 in keyof T_1 as type_fest_source_except_js.Filter<KeyType_1, type_fest.ConditionalKeys<HTMLElementTagNameMap[T], Function>>]: HTMLElementTagNameMap[T][KeyType_1]; } : never>, document?: Document) => HTMLElementTagNameMap[T];
/**
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns an `HTMLAnchorElement` created from the given `href` & `options`
 */
declare const createLink: (href: string, options?: CreateLinkOptions, document?: Document) => HTMLAnchorElement;
type CreateLinkOptions = {
    /**
     * The `textContent` property to be set on the element.
     * @defaultValue `href` passed from the *first argument*
     */
    textContent?: string;
    /**
     * If `true`, sets the `target` and `rel` properties of
     * the element accordingly to allow opening in new tabs.
     * @defaultValue `false`
     */
    newtab?: boolean;
};
/**
 * Generates an html string using the everyday
 * boilerplate code most html templates should have already.
 * Body and header contents may also optionally be inserted if provided.
 */
declare const createHTMLDoc: ({ head, body }?: {
    head?: string | undefined;
    body?: string | undefined;
}) => string;

export { createElement, createHTMLDoc, createLink, querySelectorMatchAll };
