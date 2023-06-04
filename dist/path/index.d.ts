/// <reference types="node" resolution-mode="require"/>
import type { Path } from './types.js';
import path from 'path';
export declare const sep = "/";
export declare const toUnix: (path: string) => string;
export declare const delimiter: ";" | ":";
export declare const basename: (path: string, suffix?: string | undefined) => string;
export declare const dirname: (path: string) => string;
export declare const extname: (path: string) => string;
export declare const format: (pathObject: path.FormatInputPathObject) => string;
export declare const isAbsolute: (path: string) => boolean;
export declare const join: (...paths: string[]) => string;
export declare const relative: (from: string, to: string) => string;
export declare const resolve: (...paths: string[]) => string;
export declare const toNamespacedPath: (path: string) => string;
export declare const parse: Path['parse'];
export declare const normalize: Path['normalize'];
export declare const trimExt: Path['trimExt'];
export declare const addExt: Path['addExt'];
export declare const defaultExt: Path['defaultExt'];
export declare const changeExt: Path['changeExt'];
export declare const removeExt: Path['removeExt'];
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
declare const upath: Path;
export declare const win32: Path;
export declare const posix: Path;
export default upath;
