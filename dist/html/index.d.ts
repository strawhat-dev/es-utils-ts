import { C as ConditionalExcept } from '../conditional-except.d-f489500f.js';
import { P as PartialDeep } from '../partial-deep.d-4b6146e4.js';

type HTMLTag = keyof HTMLElementTagNameMap;
type HTMLElementProps<T extends HTMLTag = 'div'> = PartialDeep<ConditionalExcept<HTMLElementTagNameMap[T], Function>>;
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
declare const createElement: <T extends keyof HTMLElementTagNameMap>(tag: T, properties?: HTMLElementProps<T> | undefined, document?: Document) => HTMLElementTagNameMap[T];
/**
 * Note: Intended for **browser** usage since the `document` object
 * is not be available in environments such as node.js. Users may
 * optionally provide an alternative implementation (e.g. `jsdom` or `linkedom`)
 * as the final argument in such environments ***(will otherwise fail)***.
 *
 * @returns an `HTMLAnchorElement` created from the given `href` & `options`
 */
declare const createLink: (href: string, options?: CreateLinkOptions, document?: Document) => HTMLAnchorElement;
/**
 * Generates an html string using the everyday
 * boilerplate code most html templates should have already.
 * Body and header contents may also optionally be inserted if provided.
 */
declare const createHTMLDoc: ({ head, body }?: {
    head?: string | undefined;
    body?: string | undefined;
}) => string;

export { HTMLElementProps, HTMLTag, createElement, createHTMLDoc, createLink, querySelectorMatchAll };
