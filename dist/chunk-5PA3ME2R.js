import { map } from './chunk-OPX7PJBV.js';
import { __name } from './chunk-JXJLGDKJ.js';
import Path from 'path';

var sep = "/";
var {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  isAbsolute,
  join,
  normalize,
  parse,
  posix,
  relative,
  resolve,
  toNamespacedPath,
  win32
} = map(Path, { inherited: true, nonEnumerable: true }, (name, prop) => [
  name,
  unixify(prop)
]);
var toUnix = /* @__PURE__ */ __name((p) => {
  return typeof p === "string" ? p.replace(/\\/g, "/").replace(/(?<!^)\/+/g, "/") : p;
}, "toUnix");
var normalizeSafe = /* @__PURE__ */ __name((p) => {
  p = toUnix(p);
  let result = normalize(p);
  if (p.startsWith("./") && !result.startsWith("./") && !result.startsWith("..")) {
    result = `./${result}`;
  } else if (p.startsWith("//") && !result.startsWith("//")) {
    result = `${p.startsWith("//./") ? "//." : "/"}${result}`;
  }
  return result;
}, "normalizeSafe");
var normalizeTrim = /* @__PURE__ */ __name((p) => normalizeSafe(p).replace(/[/]$/, ""), "normalizeTrim");
var joinSafe = /* @__PURE__ */ __name((...args) => {
  const result = join(...args);
  if (!args.length)
    return result;
  return normalizeSafe(result);
}, "joinSafe");
var trimExt = /* @__PURE__ */ __name((p, ignore = [], max = 7) => {
  const result = extname(p);
  if (!isValidExt(result, ignore, max))
    return p;
  return p.replace(new RegExp(`${result}$`), "");
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
    return trimExt(p, [], ext.length);
  return p;
}, "removeExt");
var changeExt = /* @__PURE__ */ __name((p, ext, ignore = [], max = 7) => {
  ext ?? (ext = "");
  ext[0] === "." || (ext = `.${ext}`);
  return `${trimExt(p, ignore, max)}${ext}`;
}, "changeExt");
var defaultExt = /* @__PURE__ */ __name((p, ext, ignore = [], max = 7) => {
  const result = extname(p);
  if (!isValidExt(p, ignore, max))
    return addExt(p, ext);
  return result;
}, "defaultExt");
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
  posix,
  relative,
  removeExt,
  resolve,
  sep,
  toNamespacedPath,
  toUnix,
  trimExt,
  win32
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
function isValidExt(ext, ignore = [], max = 7) {
  return ext && ext.length <= max && !ignore.some((val) => (val?.[0] === "." || (val = `.${ext}`), val === ext));
}
__name(isValidExt, "isValidExt");

export { addExt, basename, changeExt, defaultExt, delimiter, dirname, extname, format, isAbsolute, join, joinSafe, normalize, normalizeSafe, normalizeTrim, parse, path, posix, relative, removeExt, resolve, sep, toNamespacedPath, toUnix, trimExt, win32 };
