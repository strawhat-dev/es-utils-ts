import { map } from './chunk-322U5OCO.js';
import { __name } from './chunk-Q47Q2FLE.js';
import nodepath from 'path';

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
var toUnix = /* @__PURE__ */ __name((path2) => {
  if (typeof path2 !== "string")
    return path2;
  return path2.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
}, "toUnix");
var sep = "/";
var format = /* @__PURE__ */ __name((obj) => toUnix(nodepath.format(obj)), "format");
var parse = /* @__PURE__ */ __name((p) => {
  const ret = nodepath.parse(toUnix(p));
  const [root] = ret.dir.split("/");
  if (root.endsWith(":"))
    ret.root = `${root}/`;
  return ret;
}, "parse");
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
  nodepath,
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
var trimExt = /* @__PURE__ */ __name((path2, options) => {
  const ret = extname(path2);
  if (!isValidExt(ret, options))
    return path2;
  return path2.replace(new RegExp(`${ret}$`), "");
}, "trimExt");
var addExt = /* @__PURE__ */ __name((path2, ext) => {
  if (!ext)
    return path2;
  ext[0] === "." || (ext = `.${ext}`);
  path2.endsWith(ext) || (path2 = `${path2}${ext}`);
  return path2;
}, "addExt");
var removeExt = /* @__PURE__ */ __name((path2, ext) => {
  if (!ext)
    return path2;
  ext[0] === "." || (ext = `.${ext}`);
  if (extname(path2) === ext)
    return trimExt(path2, { maxLength: ext.length });
  return path2;
}, "removeExt");
var changeExt = /* @__PURE__ */ __name((path2, ext = "", options) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(path2, options)}${ext}`), "changeExt");
var defaultExt = /* @__PURE__ */ __name((path2, ext, options) => isValidExt(path2, options) ? extname(path2) : addExt(path2, ext), "defaultExt");
var path = Object.freeze({
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

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, path, relative, removeExt, resolve, sep, toUnix, trimExt };
