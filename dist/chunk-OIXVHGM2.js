import { re } from './chunk-LIVVYGBL.js';
import path from 'path';

// src/path/internal.ts
var _toUnix = (p) => p?.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
var unixify = (fn) => {
  return (...args) => {
    for (let i = 0; i < args.length; ++i) {
      typeof args[i] === "string" && (args[i] = _toUnix(args[i]));
    }
    let ret = fn(...args);
    typeof ret === "string" && (ret = _toUnix(ret));
    return ret;
  };
};
var isValidExt = (ext = "", { ignore = [], maxLength = 7 } = {}) => ext && ext.length <= maxLength && !ignore.some((val) => (val?.[0] === "." || (val = `.${ext}`), val === ext));
var _format = (pathObj) => {
  const dir = pathObj.dir || pathObj.root;
  const base = pathObj.base || (pathObj.name || "") + (pathObj.ext || "");
  if (!dir)
    return base;
  if (dir === pathObj.root)
    return dir + base;
  return `${dir}/${base}`;
};
var _parse = (path2) => {
  if (typeof path2 !== "string") {
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path2));
  }
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (!path2.length)
    return ret;
  let code = path2.charCodeAt(0);
  const isAbsolute2 = code === 47;
  isAbsolute2 && (ret.root = "/");
  let end = -1;
  let startDot = -1;
  let startPart = 0;
  let preDotState = 0;
  let matchedSlash = true;
  for (let i = path2.length - 1; i >= +isAbsolute2; --i) {
    code = path2.charCodeAt(i);
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
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || !preDotState || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (!startPart && isAbsolute2) {
        ret.base = ret.name = path2.slice(1, end);
      } else
        ret.base = ret.name = path2.slice(startPart, end);
    }
  } else {
    const start = !startPart && isAbsolute2 ? 1 : startPart;
    ret.base = path2.slice(start, end);
    ret.name = path2.slice(start, startDot);
    ret.ext = path2.slice(startDot, end);
  }
  if (startPart)
    ret.dir = path2.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
};

// src/path/index.ts
var sep = "/";
var toUnix = _toUnix;
var delimiter = path.delimiter;
var basename = unixify(path.basename);
var dirname = unixify(path.dirname);
var extname = unixify(path.extname);
var format = unixify(_format);
var isAbsolute = unixify(path.isAbsolute);
var join = unixify(path.join);
var relative = unixify(path.relative);
var resolve = unixify(path.resolve);
var toNamespacedPath = unixify(path.toNamespacedPath);
var parse = (p) => {
  const ret = _parse(toUnix(p));
  const [root] = ret.dir.split(sep);
  root.endsWith(":") && (ret.root ||= `${root}/`);
  return ret;
};
var normalize = (p) => {
  p = toUnix(p);
  let ret = toUnix(path.normalize(p));
  if (p.startsWith("./") && !ret.startsWith("./") && !ret.startsWith("..")) {
    ret = `./${ret}`;
  } else if (p.startsWith("//") && !ret.startsWith("//")) {
    ret = `${p.startsWith("//./") ? "//." : "/"}${ret}`;
  }
  return ret.endsWith(sep) ? ret.slice(0, -1) : ret;
};
var trimExt = (p, opts) => {
  const ext = extname(p);
  if (!isValidExt(ext, opts))
    return p;
  return p.replace(re`${ext}$`, "");
};
var addExt = (p, ext) => {
  if (!ext)
    return p;
  ext[0] === "." || (ext = `.${ext}`);
  p.endsWith(ext) || (p = `${p}${ext}`);
  return p;
};
var defaultExt = (p, ext, opts) => isValidExt(p, opts) ? extname(p) : addExt(p, ext);
var changeExt = (p, ext, opts) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(p, opts)}${ext}`);
var removeExt = (p, ext) => {
  if (!ext)
    return p;
  ext[0] === "." || (ext = `.${ext}`);
  if (extname(p) === ext)
    return trimExt(p, { maxLength: ext.length });
  return p;
};
var upath = {
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
  trimExt
};
upath["win32"] = upath;
upath["posix"] = upath;
Object.freeze(upath);
var win32 = upath;
var posix = upath;
var path_default = upath;

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, normalize, parse, path_default, posix, relative, removeExt, resolve, sep, toNamespacedPath, toUnix, trimExt, win32 };
