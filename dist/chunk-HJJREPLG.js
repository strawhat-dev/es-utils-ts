import { re } from './chunk-DQY34EGB.js';
import { __name } from './chunk-YRHHOPJS.js';
import path from 'path';

var sep = "/";
var delimiter = path.delimiter;
var toUnix = /* @__PURE__ */ __name((p) => p?.replace(/\\/g, sep).replace(/(?<!^)\/+/g, sep), "toUnix");
var basename = unixify(path.basename);
var dirname = unixify(path.dirname);
var extname = unixify(path.extname);
var format = unixify(path.format);
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
  const ret = path.parse(toUnix(p));
  const [root] = ret.dir.split(sep);
  root.endsWith(":") && (ret.root += sep);
  return ret;
}, "parse");
var trimExt = /* @__PURE__ */ __name((p, options) => {
  const ext = extname(p);
  if (!isValidExt(ext, options))
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
var changeExt = /* @__PURE__ */ __name((p, ext, options) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(p, options)}${ext}`), "changeExt");
var defaultExt = /* @__PURE__ */ __name((p, ext, options) => isValidExt(p, options) ? extname(p) : addExt(p, ext), "defaultExt");
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
