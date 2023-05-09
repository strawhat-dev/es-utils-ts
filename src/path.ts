/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable tree-shaking/no-side-effects-in-initialization */
import Path from 'path';
import { map } from '@/objects';

export const sep = '/';

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
]);

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
  Path,
  { inherited: true, nonEnumerable: true },
  (name, prop) => methods.has(name) && [name, unixify(prop)]
) as Path.PlatformPath;

/**
 * Converts all `\` to `/` and consolidates duplicates
 * without performing any normalization.
 */
export const toUnix = (p: string) => {
  return typeof p === 'string'
    ? p.replace(/\\/g, '/').replace(/(?<!^)\/+/g, '/')
    : p;
};

/**
 * @returns an object from a path string. *(the opposite of `path.format`)*
 */
export const parse = (p: string) => Path.posix.parse(toUnix(p));

/**
 * @returns a path string from an object. *(the opposite of `path.parse`)*
 */
// prettier-ignore
export const format = (pathObj: Path.FormatInputPathObject) => toUnix(Path.format(pathObj));

/**
 * Exactly like `path.normalize`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
export const normalizeSafe = (p: string) => {
  p = toUnix(p);
  let result = normalize(p);
  if (
    p.startsWith('./') &&
    !result.startsWith('./') &&
    !result.startsWith('..')
  ) {
    result = `./${result}`;
  } else if (p.startsWith('//') && !result.startsWith('//')) {
    result = `${p.startsWith('//./') ? '//.' : '/'}${result}`;
  }

  return result;
};

/**
 * Exactly like `path.normalizeSafe`, but it trims any useless ending `/`.
 */
// prettier-ignore
export const normalizeTrim = (p: string) => normalizeSafe(p).replace(/[/]$/, '');

/**
 * Exactly like `path.join`, but keeps the first meaningful `./` or `//`. \
 * *Note: `/` is returned everywhere, so Windows `\` is always converted to unix `/`.*
 */
export const joinSafe = (...args: Parameters<(typeof Path)['join']>) => {
  const result = join(...args);
  if (!args.length) return result;
  return normalizeSafe(result);
};

/**
 * Trims a path's extension.
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore may optionally be provided to prevent trimming.
 */
export const trimExt = (p: string, ignore: string[] = [], max = 7) => {
  const result = extname(p);
  if (!isValidExt(result, ignore, max)) return p;
  return p.replace(new RegExp(`${result}$`), '');
};

/**
 * Adds a given extension, *but only if the path provided doesn't already have the exact extension*.
 */
export const addExt = (p: string, ext: string) => {
  if (!ext) return p;
  ext[0] === '.' || (ext = `.${ext}`);
  p.endsWith(ext) || (p = `${p}${ext}`);
  return p;
};

/**
 * Remove a given extension if possible *(otherwise left as is)*.
 */
export const removeExt = (p: string, ext: string) => {
  if (!ext) return p;
  ext[0] === '.' || (ext = `.${ext}`);
  if (extname(p) === ext) return trimExt(p, [], ext.length);
  return p;
};

/**
 * Changes an extension given the `ext` provided.
 * *(Extension added if no valid extension already available)*
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore may optionally be provided to prevent trimming.
 */
export const changeExt = (
  p: string,
  ext: string,
  ignore: string[] = [],
  max = 7
) => {
  ext ??= '';
  ext[0] === '.' || (ext = `.${ext}`);
  return `${trimExt(p, ignore, max)}${ext}`;
};

/**
 * Adds a given extension, *but only if the path provided did not already have any extensions before*.
 * - Extensions are considered to be up to `max` chars long, counting the dot. *(defaults to 7)*
 * - An array of extensions to ignore will force add the default even if already present, if provided.
 */
export const defaultExt = (
  p: string,
  ext: string,
  ignore: string[] = [],
  max = 7
) => {
  const result = extname(p);
  if (!isValidExt(p, ignore, max)) return addExt(p, ext);
  return result;
};

/**
 * Drop-in replacement for node.js's path w/ unix style seperators + other utilities.
 * In most contexts Windows already allows forward slashes as the path seperator,
 * so there is no reason to stick with the legacy Windows back slash. As a universal
 * path solution for both *windows / unix*, this allows one to just use `'/'`,
 * throughout their code and forget about it. Adapted + refactored from `upath` and
 * re-exported as tree-shakeable named exports.
 *
 * Note: In non-node.js environments, you usually do not have to install `path-browserify` yourself.
 * If your code runs in the browser, bundlers like browserify or webpack include the path-browserify
 * module by default.
 *
 * @see {@link https://www.npmjs.com/package/upath}
 */
export const path = Object.freeze({
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
  posix: Path.posix,
  win32: Path.posix,
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
function isValidExt(ext: string, ignore: string[] = [], max = 7) {
  return (
    ext &&
    ext.length <= max &&
    !ignore.some((val) => (val?.[0] === '.' || (val = `.${ext}`), val === ext))
  );
}
