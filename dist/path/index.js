import path from 'path';
import { re } from '../common/index.js';
import { _format, _parse, isValidExt, toUnix as _toUnix, unixify } from './internal.js';
export const sep = '/';
export const toUnix = _toUnix;
export const delimiter = path.delimiter;
export const basename = unixify(path.basename);
export const dirname = unixify(path.dirname);
export const extname = unixify(path.extname);
export const format = unixify(_format);
export const isAbsolute = unixify(path.isAbsolute);
export const join = unixify(path.join);
export const relative = unixify(path.relative);
export const resolve = unixify(path.resolve);
export const toNamespacedPath = unixify(path.toNamespacedPath);
export const parse = (p) => {
    const ret = _parse(toUnix(p));
    const [root] = ret.dir.split(sep);
    root.endsWith(':') && (ret.root || (ret.root = `${root}/`));
    return ret;
};
export const normalize = (p) => {
    p = toUnix(p);
    let ret = toUnix(path.normalize(p));
    if (p.startsWith('./') && !ret.startsWith('./') && !ret.startsWith('..')) {
        ret = `./${ret}`;
    }
    else if (p.startsWith('//') && !ret.startsWith('//')) {
        ret = `${p.startsWith('//./') ? '//.' : '/'}${ret}`;
    }
    return ret.endsWith(sep) ? ret.slice(0, -1) : ret;
};
export const trimExt = (p, opts) => {
    const ext = extname(p);
    if (!isValidExt(ext, opts))
        return p;
    return p.replace(re `${ext}$`, '');
};
export const addExt = (p, ext) => {
    if (!ext)
        return p;
    ext[0] === '.' || (ext = `.${ext}`);
    p.endsWith(ext) || (p = `${p}${ext}`);
    return p;
};
// prettier-ignore
export const defaultExt = (p, ext, opts) => (isValidExt(p, opts) ? extname(p) : addExt(p, ext));
export const changeExt = (p, ext, opts) => (ext[0] === '.' || (ext = `.${ext}`), `${trimExt(p, opts)}${ext}`);
export const removeExt = (p, ext) => {
    if (!ext)
        return p;
    ext[0] === '.' || (ext = `.${ext}`);
    if (extname(p) === ext)
        return trimExt(p, { maxLength: ext.length });
    return p;
};
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
const upath = {
    addExt,
    basename,
    changeExt,
    defaultExt,
    delimiter,
    dirname,
    extname,
    format,
    isAbsolute,
    join,
    normalize,
    parse,
    relative,
    removeExt,
    resolve,
    sep,
    toNamespacedPath,
    toUnix,
    trimExt,
};
upath['win32'] = upath;
upath['posix'] = upath;
Object.freeze(upath);
export const win32 = upath;
export const posix = upath;
export default upath;
