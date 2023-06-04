export type TaggedTemplate = <T>(raw: TemplateStringsArray, ...subs: T[] | [...T[], (sub: T) => unknown]) => string;
export type RegexBuilder = {
    (pattern: string | RegExp, flags?: string | RegexOptions): RegExp;
    (raw: TemplateStringsArray, ...subs: unknown[]): RegExp;
};
export type RegexOptions = {
    /**
     * `[ d flag ]` *Generate indices for substring matches.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/hasIndices}
     */
    indices?: boolean;
    /**
     * `[ g flag ]` *Global search.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global}
     */
    global?: boolean;
    /**
     * `[ i flag ]` *Case-insensitive search.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase}
     */
    ignoreCase?: boolean;
    /**
     * `[ m flag ]` *Allows `^` and `$` to match newline characters.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline}
     */
    multiline?: boolean;
    /**
     * `[ s flag ]` *Allows `.` to match newline characters.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll}
     */
    dotAll?: boolean;
    /**
     * `[ u flag ]` *Unicode - treat a pattern as a sequence of Unicode code points.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode}
     */
    unicode?: boolean;
    /**
     * `[ y flag ]` *Perform a "sticky" search that matches starting at the current position in the target string.*
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky}
     */
    sticky?: boolean;
};
