/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Union } from '@/types';

import path from 'path';
import posix, { type Path } from 'path-browserify';
import { map } from '@/objects';

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
export const toUnix = (p: string) => {
  if (typeof p !== 'string') return p;
  return p.replace(/\\/g, '/').replace(/(?<!^)\/+/g, '/');
};

export const sep = '/';

export const format: Path['format'] = (po) => toUnix(posix.format(po));

export const parse: Path['parse'] = (p) => {
  const ret = posix.parse(toUnix(p));
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
  path as unknown as Path,
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
export const trimExt = (p: string, options?: ExtOptions) => {
  const ret = extname(p);
  if (!isValidExt(ret, options)) return p;
  return p.replace(new RegExp(`${ret}$`), '');
};

/**
 * Adds a given extension,
 * *but only if the path provided doesn't already have the exact extension*.
 */
export const addExt = (p: string, ext: string) => {
  if (!ext) return p;
  ext[0] === '.' || (ext = `.${ext}`);
  p.endsWith(ext) || (p = `${p}${ext}`);
  return p;
};

/**
 * Remove a given extension if possible
 * *(otherwise left as is)*.
 */
export const removeExt = (p: string, ext: string) => {
  if (!ext) return p;
  ext[0] === '.' || (ext = `.${ext}`);
  if (extname(p) === ext) return trimExt(p, { maxLength: ext.length });
  return p;
};

/**
 * Changes an extension given the `ext` provided. \
 * *(Extension added if no valid extension already available)*
 */
export const changeExt = (p: string, ext = '', options?: ExtOptions) => (
  ext[0] === '.' || (ext = `.${ext}`), `${trimExt(p, options)}${ext}`
);

/**
 * Adds a given extension,
 * *but only if the path provided did not already have any extensions before*.
 */
// prettier-ignore
export const defaultExt = (p: string, ext: string, options?: ExtOptions) => (
  isValidExt(p, options) ? extname(p) : addExt(p, ext)
);

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
  posix,
  relative,
  removeExt,
  resolve,
  sep,
  toUnix,
  trimExt,
  win32: posix,
  toNamespacedPath: toUnix,
} as const);

/** @internal */
function unixify<T>(target: T) {
  if (Array.isArray(target)) return target.map(toUnix) as T;
  if (typeof target === 'function') {
    return ((...args: any[]) => toUnix(target(...args.map(toUnix)))) as T;
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
