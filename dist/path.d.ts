import posix, { Path } from 'path-browserify';

/**
 * Converts **all** `\` to `/` and consolidates
 * duplicates without performing any normalization.
 */
declare const toUnix: (p: string) => string;
declare const sep = "/";
declare const format: Path['format'];
declare const parse: Path['parse'];
declare const basename: (path: string, ext?: string | undefined) => string;
declare const delimiter: string;
declare const dirname: (path: string) => string;
declare const extname: (path: string) => string;
declare const isAbsolute: (path: string) => boolean;
declare const join: (...paths: string[]) => string;
declare const normalize: (path: string) => string;
declare const relative: (from: string, to: string) => string;
declare const resolve: (...pathSegments: string[]) => string;
/**
 * Exactly like `path.normalize`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so windows `\` is always converted to unix `/`.*
 */
declare const normalizeSafe: Path['normalize'];
/** Exactly like `path.normalizeSafe`, but it trims any useless ending `/`. */
declare const normalizeTrim: Path['normalize'];
/**
 * Exactly like `path.join`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
declare const joinSafe: Path['join'];
/**
 * Trims a path's extension.
 */
declare const trimExt: (p: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided doesn't already have the exact extension*.
 */
declare const addExt: (p: string, ext: string) => string;
/**
 * Remove a given extension if possible
 * *(otherwise left as is)*.
 */
declare const removeExt: (p: string, ext: string) => string;
/**
 * Changes an extension given the `ext` provided. \
 * *(Extension added if no valid extension already available)*
 */
declare const changeExt: (p: string, ext?: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided did not already have any extensions before*.
 */
declare const defaultExt: (p: string, ext: string, options?: ExtOptions) => string;
/**
 * Drop-in replacement for node.js's path w/ unix style seperators + other utilities.
 * In most contexts Windows already allows forward slashes as the path seperator,
 * so there is no reason to stick with the legacy Windows back slash. As a universal
 * path solution for both *windows / unix*, this allows one to just use `'/'`,
 * throughout their code and forget about it. Adapted + refactored from `upath`.
 *
 * Note: In non-node.js environments, you usually do not have to install `path-browserify` yourself.
 * If your code runs in the browser, bundlers like browserify or webpack include the path-browserify
 * module by default.
 *
 * @see {@link https://www.npmjs.com/package/upath}
 */
declare const _default: Readonly<{
    readonly addExt: (p: string, ext: string) => string;
    readonly basename: (path: string, ext?: string | undefined) => string;
    readonly changeExt: (p: string, ext?: string, options?: ExtOptions | undefined) => string;
    readonly defaultExt: (p: string, ext: string, options?: ExtOptions | undefined) => string;
    readonly delimiter: string;
    readonly dirname: (path: string) => string;
    readonly extname: (path: string) => string;
    readonly format: (pathObject: Partial<posix.PathObject>) => string;
    readonly isAbsolute: (path: string) => boolean;
    readonly join: (...paths: string[]) => string;
    readonly joinSafe: (...paths: string[]) => string;
    readonly normalize: (path: string) => string;
    readonly normalizeSafe: (path: string) => string;
    readonly normalizeTrim: (path: string) => string;
    readonly parse: (path: string) => posix.PathObject;
    readonly posix: posix.Path;
    readonly relative: (from: string, to: string) => string;
    readonly removeExt: (p: string, ext: string) => string;
    readonly resolve: (...pathSegments: string[]) => string;
    readonly sep: "/";
    readonly toUnix: (p: string) => string;
    readonly trimExt: (p: string, options?: ExtOptions | undefined) => string;
    readonly win32: posix.Path;
    readonly toNamespacedPath: (p: string) => string;
}>;

/** @internal */
type ExtOptions = {
    /**
     * Do not the consider extensions listed, if provided.
     */
    ignore?: string[];
    /**
     * Consider extensions up to `maxLength` long *(counting the `.`)*.
     * @defaultValue `7`
     */
    maxLength?: number;
};

export { addExt, basename, changeExt, _default as default, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, relative, removeExt, resolve, sep, toUnix, trimExt };
