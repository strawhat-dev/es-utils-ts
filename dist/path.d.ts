/// <reference types="node" />
import _, { type PlatformPath as Path } from 'path';
/**
 * Converts **all** `\` to `/` and consolidates
 * duplicates without performing any normalization.
 */
export declare const toUnix: (path: string) => string;
export declare const sep: Path['sep'];
export declare const format: Path['format'];
export declare const parse: Path['parse'];
export declare const basename: (path: string, suffix?: string | undefined) => string, delimiter: ";" | ":", dirname: (path: string) => string, extname: (path: string) => string, isAbsolute: (path: string) => boolean, join: (...paths: string[]) => string, normalize: (path: string) => string, relative: (from: string, to: string) => string, resolve: (...paths: string[]) => string;
/**
 * Exactly like `path.normalize`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so windows `\` is always converted to unix `/`.*
 */
export declare const normalizeSafe: Path['normalize'];
/** Exactly like `path.normalizeSafe`, but it trims any useless ending `/`. */
export declare const normalizeTrim: Path['normalize'];
/**
 * Exactly like `path.join`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
export declare const joinSafe: Path['join'];
/**
 * Trims a path's extension.
 */
export declare const trimExt: (path: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided doesn't already have the exact extension*.
 */
export declare const addExt: (path: string, ext: string) => string;
/**
 * Remove a given extension if possible
 * *(otherwise left as is)*.
 */
export declare const removeExt: (path: string, ext: string) => string;
/**
 * Changes an extension given the `ext` provided. \
 * *(Extension added if no valid extension already available)*
 */
export declare const changeExt: (path: string, ext?: string, options?: ExtOptions) => string;
/**
 * Adds a given extension,
 * *but only if the path provided did not already have any extensions before*.
 */
export declare const defaultExt: (path: string, ext: string, options?: ExtOptions) => string;
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
export declare const posix: Readonly<{
    addExt: (path: string, ext: string) => string;
    basename: (path: string, suffix?: string | undefined) => string;
    changeExt: (path: string, ext?: string, options?: ExtOptions) => string;
    defaultExt: (path: string, ext: string, options?: ExtOptions) => string;
    delimiter: ";" | ":";
    dirname: (path: string) => string;
    extname: (path: string) => string;
    format: (pathObject: _.FormatInputPathObject) => string;
    isAbsolute: (path: string) => boolean;
    join: (...paths: string[]) => string;
    joinSafe: (...paths: string[]) => string;
    normalize: (path: string) => string;
    normalizeSafe: (path: string) => string;
    normalizeTrim: (path: string) => string;
    parse: (path: string) => _.ParsedPath;
    relative: (from: string, to: string) => string;
    removeExt: (path: string, ext: string) => string;
    resolve: (...paths: string[]) => string;
    sep: "/";
    toUnix: (path: string) => string;
    trimExt: (path: string, options?: ExtOptions) => string;
    posix: _.PlatformPath;
    win32: _.PlatformPath;
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
export {};
//# sourceMappingURL=path.d.ts.map