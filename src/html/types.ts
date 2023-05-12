import type { ConditionalExcept, PartialDeep } from '../types';

export type HTMLTag = keyof HTMLElementTagNameMap;

export type HTMLElementProps<T extends HTMLTag = 'div'> = PartialDeep<
  ConditionalExcept<HTMLElementTagNameMap[T], Function>
>;

export type CreateLinkOptions = {
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
