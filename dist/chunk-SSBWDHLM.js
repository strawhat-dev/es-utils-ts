import { re } from './chunk-MVICGNT5.js';
import { assert } from './chunk-KWJFEMZN.js';
import { __name } from './chunk-YRHHOPJS.js';
import path from 'path';

// src/path/internal.ts
var _format = /* @__PURE__ */ __name((pathObj) => {
  assert.isObject(pathObj, { onError: "throw" });
  const dir = pathObj.dir || pathObj.root;
  const base = pathObj.base || (pathObj.name || "") + (pathObj.ext || "");
  if (!dir)
    return base;
  if (dir === pathObj.root)
    return `${dir}${base}`;
  return `${dir}/${base}`;
}, "_format");
var _parse = /* @__PURE__ */ __name((path2) => {
  assert.isString(path2, { onError: "throw" });
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
    if (!startPart && isAbsolute2) {
      ret.name = path2.slice(1, startDot);
      ret.base = path2.slice(1, end);
    } else {
      ret.name = path2.slice(startPart, startDot);
      ret.base = path2.slice(startPart, end);
    }
    ret.ext = path2.slice(startDot, end);
  }
  if (startPart)
    ret.dir = path2.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}, "_parse");

// src/path/index.ts
var sep = "/";
var delimiter = path.delimiter;
var toUnix = /* @__PURE__ */ __name((p) => p?.replace(/\\/g, sep).replace(/(?<!^)\/+/g, sep), "toUnix");
var basename = unixify(path.basename);
var dirname = unixify(path.dirname);
var extname = unixify(path.extname);
var format = unixify(_format);
var isAbsolute = unixify(path.isAbsolute);
var join = unixify(path.join);
var relative = unixify(path.relative);
var resolve = unixify(path.resolve);
var toNamespacedPath = unixify(path.toNamespacedPath);
var normalize = /* @__PURE__ */ __name((p) => {
  p = toUnix(p);
  let ret = toUnix(path.normalize(p));
  if (p.startsWith("./") && !ret.startsWith("./") && !ret.startsWith("..")) {
    ret = `./${ret}`;
  } else if (p.startsWith("//") && !ret.startsWith("//")) {
    ret = `${p.startsWith("//./") ? "//." : "/"}${ret}`;
  }
  return ret.endsWith(sep) ? ret.slice(0, -1) : ret;
}, "normalize");
var parse = /* @__PURE__ */ __name((p) => {
  const ret = _parse(toUnix(p));
  const [root] = ret.dir.split(sep);
  root.endsWith(":") && (ret.root ||= `${root}/`);
  return ret;
}, "parse");
var trimExt = /* @__PURE__ */ __name((p, opts) => {
  const ext = extname(p);
  if (!isValidExt(ext, opts))
    return p;
  return p.replace(re`${ext}$`, "");
}, "trimExt");
var addExt = /* @__PURE__ */ __name((p, ext) => {
  if (!ext)
    return p;
  ext[0] === "." || (ext = `.${ext}`);
  p.endsWith(ext) || (p = `${p}${ext}`);
  return p;
}, "addExt");
var removeExt = /* @__PURE__ */ __name((p, ext) => {
  if (!ext)
    return p;
  ext[0] === "." || (ext = `.${ext}`);
  if (extname(p) === ext)
    return trimExt(p, { maxLength: ext.length });
  return p;
}, "removeExt");
var changeExt = /* @__PURE__ */ __name((p, ext, opts) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(p, opts)}${ext}`), "changeExt");
var defaultExt = /* @__PURE__ */ __name((p, ext, opts) => isValidExt(p, opts) ? extname(p) : addExt(p, ext), "defaultExt");
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
function unixify(fn) {
  return (...args) => {
    for (let i = 0; i < args.length; ++i) {
      typeof args[i] === "string" && (args[i] = toUnix(args[i]));
    }
    const ret = fn(...args);
    return typeof ret === "string" ? toUnix(ret) : ret;
  };
}
__name(unixify, "unixify");
function isValidExt(ext = "", { ignore = [], maxLength = 7 } = {}) {
  return ext && ext.length <= maxLength && !ignore.some((val) => (val?.[0] === "." || (val = `.${ext}`), val === ext));
}
__name(isValidExt, "isValidExt");

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, normalize, parse, posix, relative, removeExt, resolve, sep, toNamespacedPath, toUnix, trimExt, win32 };
