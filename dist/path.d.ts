import posix, { Path } from 'path-browserify';

/**
 * Converts **all** `\` to `/` and consolidates
 * duplicates without performing any normalization.
 */
declare const toUnix: (path: string) => string;
declare const sep: Path['sep'];
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
declare const trimExt: (path: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided doesn't already have the exact extension*.
 */
declare const addExt: (path: string, ext: string) => string;
/**
 * Remove a given extension if possible
 * *(otherwise left as is)*.
 */
declare const removeExt: (path: string, ext: string) => string;
/**
 * Changes an extension given the `ext` provided. \
 * *(Extension added if no valid extension already available)*
 */
declare const changeExt: (path: string, ext?: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided did not already have any extensions before*.
 */
declare const defaultExt: (path: string, ext: string, options?: ExtOptions) => string;
/**
 * Universal drop-in replacement for node.js's path w/ unix style seperators + other utilities.
 * In most contexts windows, already allows forward slashes as the path seperator,
 * so there is no reason to stick with the legacy back slash. As a universal
 * path solution for both *windows + unix*, this allows one to just use `'/'`,
 * throughout their code and worrying about it. Adapted and refactored from `upath`.
 *
 * Note: In non-node.js environments, you usually do not have to install `path-browserify` yourself.
 * If your code runs in the browser, bundlers like browserify or webpack include the path-browserify
 * module by default.
 *
 * @see {@link https://nodejs.org/api/path.html}
 * @see {@link https://www.npmjs.com/package/upath}
 */
declare const _default: Readonly<{
    addExt: (path: string, ext: string) => string;
    basename: (path: string, ext?: string | undefined) => string;
    changeExt: (path: string, ext?: string, options?: ExtOptions | undefined) => string;
    defaultExt: (path: string, ext: string, options?: ExtOptions | undefined) => string;
    delimiter: string;
    dirname: (path: string) => string;
    extname: (path: string) => string;
    format: (pathObject: Partial<posix.PathObject>) => string;
    isAbsolute: (path: string) => boolean;
    join: (...paths: string[]) => string;
    joinSafe: (...paths: string[]) => string;
    normalize: (path: string) => string;
    normalizeSafe: (path: string) => string;
    normalizeTrim: (path: string) => string;
    parse: (path: string) => posix.PathObject;
    posix: posix.Path;
    relative: (from: string, to: string) => string;
    removeExt: (path: string, ext: string) => string;
    resolve: (...pathSegments: string[]) => string;
    sep: string;
    toUnix: (path: string) => string;
    trimExt: (path: string, options?: ExtOptions | undefined) => string;
    win32: posix.Path;
    toNamespacedPath: (path: string) => string;
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
