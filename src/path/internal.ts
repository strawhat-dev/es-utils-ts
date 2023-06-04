import type { Path } from './types.js';
import type { Fn } from '../type-utils.js';

import { assert } from '../conditionals/index.js';

// prettier-ignore
export const toUnix: Path['toUnix'] = (p) => p?.replace(/\\/g, '/').replace(/(?<!^)\/+/g, '/');

/** @internal */
export const unixify = <T extends Fn>(fn: T) => {
  return ((...args) => {
    for (let i = 0; i < args.length; ++i) {
      typeof args[i] === 'string' && (args[i] = toUnix(args[i]));
    }

    const ret = fn(...args);
    return typeof ret === 'string' ? toUnix(ret) : ret;
  }) as T;
};

/** @internal */
// prettier-ignore
export const isValidExt = (
  ext = '',
  { ignore = [] as string[], maxLength = 7 } = {}
) => (
  ext &&
  ext.length <= maxLength &&
  !ignore.some((val) => (val?.[0] === '.' || (val = `.${ext}`), val === ext))
);

/** @internal */
// https://github.com/browserify/path-browserify/blob/master/index.js#L99
export const _format: Path['format'] = (pathObj) => {
  assert.isObject(pathObj, { onError: 'throw' });
  const dir = pathObj.dir || pathObj.root;
  const base = pathObj.base || (pathObj.name || '') + (pathObj.ext || '');
  if (!dir) return base;
  if (dir === pathObj.root) return `${dir}${base}`;
  return `${dir}/${base}`;
};

/** @internal */
// https://github.com/browserify/path-browserify/blob/master/index.js#L445
export const _parse: Path['parse'] = (path) => {
  assert.isString(path, { onError: 'throw' });
  const ret = { root: '', dir: '', base: '', ext: '', name: '' };
  if (!path.length) return ret;
  let code = path.charCodeAt(0);
  const isAbsolute = code === 47;
  isAbsolute && (ret.root = '/');
  let end = -1;
  let startDot = -1;
  let startPart = 0;
  let preDotState = 0;
  let matchedSlash = true;
  for (let i = path.length - 1; i >= +isAbsolute; --i) {
    code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }

    if (end === -1) {
      end = i + 1;
      matchedSlash = false;
    }

    if (code === 46) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) preDotState = -1;
  }

  if (
    startDot === -1 ||
    end === -1 ||
    !preDotState ||
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  ) {
    if (end !== -1) {
      if (!startPart && isAbsolute) {
        ret.base = ret.name = path.slice(1, end);
      } else ret.base = ret.name = path.slice(startPart, end);
    }
  } else {
    const start = !startPart && isAbsolute ? 1 : startPart;
    ret.base = path.slice(start, end);
    ret.name = path.slice(start, startDot);
    ret.ext = path.slice(startDot, end);
  }

  if (startPart) ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute) ret.dir = '/';
  return ret;
};
