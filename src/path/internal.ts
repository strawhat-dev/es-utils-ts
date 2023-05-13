import type { Path } from './types';

import { assert } from '../conditionals';

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
    if (!startPart && isAbsolute) {
      ret.name = path.slice(1, startDot);
      ret.base = path.slice(1, end);
    } else {
      ret.name = path.slice(startPart, startDot);
      ret.base = path.slice(startPart, end);
    }

    ret.ext = path.slice(startDot, end);
  }

  if (startPart) ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute) ret.dir = '/';
  return ret;
};
