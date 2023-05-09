import Path from 'path';

declare const sep = "/";
declare const basename: (path: string, suffix?: string | undefined) => string;
declare const delimiter: ";" | ":";
declare const dirname: (path: string) => string;
declare const extname: (path: string) => string;
declare const format: (pathObject: Path.FormatInputPathObject) => string;
declare const isAbsolute: (path: string) => boolean;
declare const join: (...paths: string[]) => string;
declare const normalize: (path: string) => string;
declare const parse: (path: string) => Path.ParsedPath;
declare const posix: Path.PlatformPath;
declare const relative: (from: string, to: string) => string;
declare const resolve: (...paths: string[]) => string;
declare const toNamespacedPath: (path: string) => string;
declare const win32: Path.PlatformPath;
/**
 * Converts all `\` to `/` and consolidates duplicates
 * without performing any normalization.
 */
declare const toUnix: (p: string) => string;
/**
 * Exactly like `path.normalize`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
declare const normalizeSafe: (p: string) => string;
/**
 * Exactly like `path.normalizeSafe`, but it trims any useless ending `/`.
 */
declare const normalizeTrim: (p: string) => string;
/**
 * Exactly like `path.join`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
declare const joinSafe: (...args: Parameters<(typeof Path)['join']>) => string;
/**
 * Trims a path's extension.
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore may optionally be provided to prevent trimming.
 */
declare const trimExt: (p: string, ignore?: string[], max?: number) => string;
/**
 * Adds a given extension, *but only if the path provided doesn't already have the exact extension*.
 */
declare const addExt: (p: string, ext: string) => string;
/**
 * Remove a given extension if possible *(otherwise left as is)*.
 */
declare const removeExt: (p: string, ext: string) => string;
/**
 * Changes an extension given the `ext` provided.
 * *(Extension added if no valid extension already available)*
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore may optionally be provided to prevent trimming.
 */
declare const changeExt: (p: string, ext: string, ignore?: string[], max?: number) => string;
/**
 * Adds a given extension, *but only if the path provided did not already have any extensions before*.
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore will force add the default even if already present, if provided.
 */
declare const defaultExt: (p: string, ext: string, ignore?: string[], max?: number) => string;
/**
 * Drop-in replacement for node.js's path w/ unix style seperators + other utilities.
 * In most contexts Windows already allows forward slashes as the path seperator,
 * so there is no reason to stick with the legacy Windows back slash. As a universal
 * path solution for both *windows / unix*, this allows one to just use `'/'`,
 * throughout their code and forget about it. Adapted + refactored from {@link https://www.npmjs.com/package/upath | upath},
 * and re-exported as tree-shakeable named exports.
 *
 * Note: In non-node.js environments, you usually do not have to install `path-browserify` yourself.
 * If your code runs in the browser, bundlers like browserify or webpack include the path-browserify
 * module by default.
 */
declare const path: Readonly<{
    readonly addExt: (p: string, ext: string) => string;
    readonly basename: (path: string, suffix?: string | undefined) => string;
    readonly changeExt: (p: string, ext: string, ignore?: string[], max?: number) => string;
    readonly defaultExt: (p: string, ext: string, ignore?: string[], max?: number) => string;
    readonly delimiter: ";" | ":";
    readonly dirname: (path: string) => string;
    readonly extname: (path: string) => string;
    readonly format: (pathObject: Path.FormatInputPathObject) => string;
    readonly isAbsolute: (path: string) => boolean;
    readonly join: (...paths: string[]) => string;
    readonly joinSafe: (...args: Parameters<(typeof Path)['join']>) => string;
    readonly normalize: (path: string) => string;
    readonly normalizeSafe: (p: string) => string;
    readonly normalizeTrim: (p: string) => string;
    readonly parse: (path: string) => Path.ParsedPath;
    readonly posix: Path.PlatformPath;
    readonly relative: (from: string, to: string) => string;
    readonly removeExt: (p: string, ext: string) => string;
    readonly resolve: (...paths: string[]) => string;
    readonly sep: "/";
    readonly toNamespacedPath: (path: string) => string;
    readonly toUnix: (p: string) => string;
    readonly trimExt: (p: string, ignore?: string[], max?: number) => string;
    readonly win32: Path.PlatformPath;
}>;

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, path, posix, relative, removeExt, resolve, sep, toNamespacedPath, toUnix, trimExt, win32 };
