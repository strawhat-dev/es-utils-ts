import { map } from './chunk-322U5OCO.js';
import { __name } from './chunk-Q47Q2FLE.js';
import _ from 'path';
import { format as format$1, parse as parse$1, posix as posix$1 } from 'path-browserify';

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
var toUnix = /* @__PURE__ */ __name((path) => {
  if (typeof path !== "string")
    return path;
  return path.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/");
}, "toUnix");
var sep = "/";
var format = /* @__PURE__ */ __name((obj) => toUnix(format$1(obj)), "format");
var parse = /* @__PURE__ */ __name((p) => {
  const ret = parse$1(toUnix(p));
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
  _,
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
var trimExt = /* @__PURE__ */ __name((path, options) => {
  const ret = extname(path);
  if (!isValidExt(ret, options))
    return path;
  return path.replace(new RegExp(`${ret}$`), "");
}, "trimExt");
var addExt = /* @__PURE__ */ __name((path, ext) => {
  if (!ext)
    return path;
  ext[0] === "." || (ext = `.${ext}`);
  path.endsWith(ext) || (path = `${path}${ext}`);
  return path;
}, "addExt");
var removeExt = /* @__PURE__ */ __name((path, ext) => {
  if (!ext)
    return path;
  ext[0] === "." || (ext = `.${ext}`);
  if (extname(path) === ext)
    return trimExt(path, { maxLength: ext.length });
  return path;
}, "removeExt");
var changeExt = /* @__PURE__ */ __name((path, ext = "", options) => (ext[0] === "." || (ext = `.${ext}`), `${trimExt(path, options)}${ext}`), "changeExt");
var defaultExt = /* @__PURE__ */ __name((path, ext, options) => isValidExt(path, options) ? extname(path) : addExt(path, ext), "defaultExt");
var posix = Object.freeze({
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
  posix: posix$1,
  win32: posix$1,
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

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, posix, relative, removeExt, resolve, sep, toUnix, trimExt };
