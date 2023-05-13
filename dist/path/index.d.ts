import { PlatformPath } from 'path/posix';
import path from 'path';

interface Path extends PlatformPath {
    posix: Path;
    win32: Path;
    /**
     * Converts **all** `\` to `/` and consolidates
     * duplicates without performing any normalization.
     */
    toUnix(path: string): string;
    /**
     * Trims a path's extension.
     */
    trimExt(path: string, options?: ExtOptions): string;
    /**
     * Adds a given extension,
     * *but only if the path provided doesn't already have the exact extension*.
     */
    addExt(path: string, ext: string): string;
    /**
     * Remove a given extension if possible
     * *(otherwise left as is)*.
     */
    removeExt(path: string, ext: string): string;
    /**
     * Changes an extension given the `ext` provided. \
     * *(Extension added if no valid extension already available)*
     */
    changeExt(path: string, ext: string, options?: ExtOptions): string;
    /**
     * Adds a given extension,
     * *but only if the path provided did not already have any extensions before*.
     */
    defaultExt(path: string, ext: string, options?: ExtOptions): string;
}
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

declare const sep = "/";
declare const delimiter: ";" | ":";
declare const toUnix: Path['toUnix'];
declare const basename: (path: string, suffix?: string | undefined) => string;
declare const dirname: (path: string) => string;
declare const extname: (path: string) => string;
declare const format: (pathObj: path.FormatInputPathObject) => string;
declare const isAbsolute: (path: string) => boolean;
declare const join: (...paths: string[]) => string;
declare const relative: (from: string, to: string) => string;
declare const resolve: (...paths: string[]) => string;
declare const toNamespacedPath: (path: string) => string;
declare const normalize: Path['normalize'];
declare const parse: Path['parse'];
declare const trimExt: Path['trimExt'];
declare const addExt: Path['addExt'];
declare const removeExt: Path['removeExt'];
declare const changeExt: Path['changeExt'];
declare const defaultExt: Path['defaultExt'];
declare const win32: Path;
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
declare const posix: Path;

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, normalize, parse, posix, relative, removeExt, resolve, sep, toNamespacedPath, toUnix, trimExt, win32 };
