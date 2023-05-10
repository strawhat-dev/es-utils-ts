import { map } from './chunk-OPX7PJBV.js';
import { __name } from './chunk-JXJLGDKJ.js';
import path from 'path';
import posix from 'path-browserify';

var toUnix = /* @__PURE__ */ __name((p) => {
  if (typeof p !== "string")
    return p;
  return p.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
}, "toUnix");
var sep = "/";
var parse = /* @__PURE__ */ __name((p) => posix.parse(toUnix(p)), "parse");
var format = /* @__PURE__ */ __name((po) => toUnix(posix.format(po)), "format");
var {
  basename,
  delimiter,
  dirname,
  extname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve
} = map(
  path,
  { inherited: true, nonEnumerable: true },
  (name, prop) => methods.has(name) && [name, unixify(prop)]
);
var normalizeSafe = /* @__PURE__ */ __name((p) => {
  p = toUnix(p);
  let ret = normalize(p);
  if (p.startsWith("./") && !ret.startsWith("./") && !ret.startsWith("..")) {
    ret = `./${ret}`;
  } else if (p.startsWith("//") && !ret.startsWith("//")) {
    ret = `${p.startsWith("//./") ? "//." : "/"}${ret}`;
  }
  return ret;
}, "normalizeSafe");
var normalizeTrim = /* @__PURE__ */ __name((p) => normalizeSafe(p).replace(/[/]$/, ""), "normalizeTrim");
var joinSafe = /* @__PURE__ */ __name((...args) => {
  const ret = join(...args);
  if (!args.length)
    return ret;
  return normalizeSafe(ret);
}, "joinSafe");
var trimExt = /* @__PURE__ */ __name((p, options) => {
  const ret = extname(p);
  if (!isValidExt(ret, options))
    return p;
  return p.replace(new RegExp(`${ret}$`), "");
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
var changeExt = /* @__PURE__ */ __name((p, ext = "", options) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(p, options)}${ext}`), "changeExt");
var defaultExt = /* @__PURE__ */ __name((p, ext, options) => isValidExt(p, options) ? extname(p) : addExt(p, ext), "defaultExt");
var path_default = Object.freeze({
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
  toNamespacedPath: toUnix
});
function unixify(target) {
  if (Array.isArray(target))
    return target.map(toUnix);
  if (typeof target === "function") {
    return (...args) => toUnix(target(...args.map(toUnix)));
  }
  return target;
}
__name(unixify, "unixify");
function isValidExt(ext, { ignore = [], maxLength = 7 } = {}) {
  return ext && ext.length <= maxLength && !ignore.some((val) => (val?.[0] === "." || (val = `.${ext}`), val === ext));
}
__name(isValidExt, "isValidExt");
var methods = /* @__PURE__ */ new Set([
  "basename",
  "delimiter",
  "dirname",
  "extname",
  "isAbsolute",
  "join",
  "normalize",
  "relative",
  "resolve"
]);

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, path_default, relative, removeExt, resolve, sep, toUnix, trimExt };
