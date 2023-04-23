// src/assertions.ts
var type = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1);
};
var nullish = (value) => {
  return typeof value === "undefined" || value === null;
};
var not = (value) => {
  return nullish(value) || Number.isNaN(value) || value === false;
};
var assert = {
  isArray: Array.isArray,
  isArrayBuffer: (value) => /ArrayBuffer$/.test(type(value)),
  isAsyncFunction: (value) => /^Async\w*Function$/.test(type(value)),
  isDate: (value) => type(value) === "Date",
  isElement: (value) => value instanceof Element || value instanceof Document,
  isError: (value) => type(value) === "Error",
  isFunction: (value) => typeof value === "function",
  isIterable: (value) => !!value?.[Symbol.iterator],
  isIterator: (value) => /Iterator$/.test(type(value)),
  isMap: (value) => type(value) === "Map",
  isObject: (value) => type(value) === "Object",
  isPrimitive: (value) => value !== Object(value),
  isPromise: (value) => type(value) === "Promise",
  isRegExp: (value) => type(value) === "RegExp",
  isSet: (value) => type(value) === "Set",
  isTypedArray: (value) => ArrayBuffer.isView(value) && !(value instanceof DataView),
  isWeakMap: (value) => type(value) === "WeakMap",
  isWeakSet: (value) => type(value) === "WeakSet"
};
var {
  isArray,
  isArrayBuffer,
  isAsyncFunction,
  isDate,
  isElement,
  isError,
  isFunction,
  isIterable,
  isIterator,
  isMap,
  isObject,
  isPrimitive,
  isPromise,
  isRegExp,
  isSet,
  isTypedArray,
  isWeakMap,
  isWeakSet
} = assert;

export { assert, isArray, isArrayBuffer, isAsyncFunction, isDate, isElement, isError, isFunction, isIterable, isIterator, isMap, isObject, isPrimitive, isPromise, isRegExp, isSet, isTypedArray, isWeakMap, isWeakSet, not, nullish, type };
