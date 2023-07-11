import { nullishOrFalse, isTemplateStringsArray } from './chunk-WEJR7A5E.js';
import escapeStringRegexp from 'escape-string-regexp';

var RE_FLAG_PATTERN = /[/]\b(?!\w*(\w)\w*\1)[dgimsuy]+\b$/;
var RE_FLAG_OPTION = {
  indices: "d",
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  dotAll: "s",
  unicode: "u",
  sticky: "y"
};
var linesOf = (s) => {
  const ret = [];
  const lines = s.split(/\r?\n/);
  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    line.trim() && ret.push(line);
  }
  return ret;
};
var trimLines = (s) => linesOf(s).join("\n").trim();
var t = (raw, ...subs) => {
  const map = typeof subs.at(-1) === "function" ? subs.pop() : (sub) => nullishOrFalse(sub) ? "" : sub;
  for (let i = 0; i < subs.length; ++i)
    subs[i] = map(subs[i]);
  return String.raw({ raw }, ...subs);
};
var re = (...args) => {
  let [pattern, flags = ""] = args;
  if (isTemplateStringsArray(pattern)) {
    pattern = t(
      ...args,
      (sub) => escapeStringRegexp((sub ?? "").toString())
    );
    flags = (pattern.match(RE_FLAG_PATTERN) || [""])[0].slice(1);
    flags && (pattern = pattern.replace(RE_FLAG_PATTERN, ""));
  } else if (typeof flags === "object") {
    flags = "";
    for (const opt in flags) {
      flags += RE_FLAG_OPTION[opt] ?? "";
    }
  }
  return new RegExp(pattern, flags);
};

export { linesOf, re, t, trimLines };
