import type { Union } from '@/types';

import { map } from '@/objects';
import nodepath, { type PlatformPath as Path } from 'path';
import { format as fmt, parse as parsepath } from 'path-browserify';

const methods = new Set([
  'basename',
  'delimiter',
  'dirname',
  'extname',
  'isAbsolute',
  'join',
  'normalize',
  'relative',
  'resolve',
] as Union<keyof Path>[]);

/**
 * Converts **all** `\` to `/` and consolidates
 * duplicates without performing any normalization.
 */
export const toUnix = (path: string) => {
  if (typeof path !== 'string') return path;
  return path.replace(/\\/g, '/').replace(/(?<!^)\/+/g, '/');
};

export const sep: Path['sep'] = '/';

export const format: Path['format'] = (obj) => toUnix(fmt(obj));

export const parse: Path['parse'] = (p) => {
  const ret = parsepath(toUnix(p));
  const [root] = ret.dir.split('/');
  if (root.endsWith(':')) ret.root = `${root}/`;
  return ret;
};

export const {
  basename,
  delimiter,
  dirname,
  extname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
} = map(
  nodepath,
  { inherited: true, nonEnumerable: true },
  (name, prop) => methods.has(name) && [name, unixify(prop)]
) as Path;

/**
 * Exactly like `path.normalize`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so windows `\` is always converted to unix `/`.*
 */
export const normalizeSafe: Path['normalize'] = (p) => {
  p = toUnix(p);
  let ret = normalize(p);
  if (p.startsWith('./') && !ret.startsWith('./') && !ret.startsWith('..')) {
    ret = `./${ret}`;
  } else if (p.startsWith('//') && !ret.startsWith('//')) {
    ret = `${p.startsWith('//./') ? '//.' : '/'}${ret}`;
  }

  return ret;
};

// prettier-ignore
/** Exactly like `path.normalizeSafe`, but it trims any useless ending `/`. */
export const normalizeTrim: Path['normalize'] = (p) => normalizeSafe(p).replace(/[/]$/, '');

/**
 * Exactly like `path.join`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
export const joinSafe: Path['join'] = (...args) => {
  const ret = join(...args);
  if (!args.length) return ret;
  return normalizeSafe(ret);
};

/**
 * Trims a path's extension.
 */
export const trimExt = (path: string, options?: ExtOptions) => {
  const ret = extname(path);
  if (!isValidExt(ret, options)) return path;
  return path.replace(new RegExp(`${ret}$`), '');
};

/**
 * Adds a given extension,
 * *but only if the path provided doesn't already have the exact extension*.
 */
export const addExt = (path: string, ext: string) => {
  if (!ext) return path;
  ext[0] === '.' || (ext = `.${ext}`);
  path.endsWith(ext) || (path = `${path}${ext}`);
  return path;
};

/**
 * Remove a given extension if possible
 * *(otherwise left as is)*.
 */
export const removeExt = (path: string, ext: string) => {
  if (!ext) return path;
  ext[0] === '.' || (ext = `.${ext}`);
  if (extname(path) === ext) return trimExt(path, { maxLength: ext.length });
  return path;
};

/**
 * Changes an extension given the `ext` provided. \
 * *(Extension added if no valid extension already available)*
 */
export const changeExt = (path: string, ext = '', options?: ExtOptions) => (
  ext[0] === '.' || (ext = `.${ext}`), `${trimExt(path, options)}${ext}`
);

/**
 * Adds a given extension,
 * *but only if the path provided did not already have any extensions before*.
 */
// prettier-ignore
export const defaultExt = (path: string, ext: string, options?: ExtOptions) => (
  isValidExt(path, options) ? extname(path) : addExt(path, ext)
);

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
export default Object.freeze({
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
  joinSafe,
  normalize,
  normalizeSafe,
  normalizeTrim,
  parse,
  relative,
  removeExt,
  resolve,
  sep,
  toUnix,
  trimExt,
  posix: nodepath.posix,
  win32: nodepath.posix,
  toNamespacedPath: toUnix,
});

/** @internal */
function unixify<T>(target: T) {
  if (Array.isArray(target)) return target.map(toUnix) as T;
  if (typeof target === 'function') {
    return ((...args: never[]) => toUnix(target(...args.map(toUnix)))) as T;
  }

  return target;
}

/** @internal */
function isValidExt(
  ext: string,
  { ignore = [], maxLength = 7 }: ExtOptions = {}
) {
  return (
    ext &&
    ext.length <= maxLength &&
    !ignore.some((val) => (val?.[0] === '.' || (val = `.${ext}`), val === ext))
  );
}

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
