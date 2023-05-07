import default2, { deepcompare } from './chunk-HEWJAYP7.js';
import { __name } from './chunk-HXRSFH6L.js';

// src/conditionals/type-checking.ts
var type = /* @__PURE__ */ __name((value) => Object.prototype.toString.call(value).slice(8, -1), "type");
var isArrayBuffer = /* @__PURE__ */ __name((value) => /^(Shared)?ArrayBuffer$/.test(type(value)), "isArrayBuffer");
var isAsyncFunction = /* @__PURE__ */ __name((value) => type(value) === "AsyncFunction", "isAsyncFunction");
var isAsyncGeneratorFunction = /* @__PURE__ */ __name((value) => type(value) === "AsyncGeneratorFunction", "isAsyncGeneratorFunction");
var isAsyncIterable = /* @__PURE__ */ __name((value) => !!value?.[Symbol.asyncIterator], "isAsyncIterable");
var isAsyncIterator = /* @__PURE__ */ __name((value) => /^Async.*(Generator|Iterator)$/.test(type(value)), "isAsyncIterator");
var isConstructor = /* @__PURE__ */ __name((value) => !!value && value["prototype"]?.constructor === value, "isConstructor");
var isDate = /* @__PURE__ */ __name((value) => type(value) === "Date", "isDate");
var isElement = /* @__PURE__ */ __name((value) => value instanceof Element || value instanceof Document, "isElement");
var isError = /* @__PURE__ */ __name((value) => type(value) === "Error", "isError");
var isGeneratorFunction = /* @__PURE__ */ __name((value) => type(value) === "GeneratorFunction", "isGeneratorFunction");
var isIterable = /* @__PURE__ */ __name((value) => !!value?.[Symbol.iterator], "isIterable");
var isIterator = /* @__PURE__ */ __name((value) => /(^Generator|Iterator)$/.test(type(value)), "isIterator");
var isMap = /* @__PURE__ */ __name((value) => type(value) === "Map", "isMap");
var isObject = /* @__PURE__ */ __name((value) => type(value) === "Object", "isObject");
var isPrimitive = /* @__PURE__ */ __name((value) => value !== Object(value), "isPrimitive");
var isPromise = /* @__PURE__ */ __name((value) => type(value) === "Promise", "isPromise");
var isRegExp = /* @__PURE__ */ __name((value) => type(value) === "RegExp", "isRegExp");
var isRequest = /* @__PURE__ */ __name((value) => type(value) === "Request", "isRequest");
var isSet = /* @__PURE__ */ __name((value) => type(value) === "Set", "isSet");
var isTypedArray = /* @__PURE__ */ __name((value) => ArrayBuffer.isView(value) && !(value instanceof DataView), "isTypedArray");
var isWeakMap = /* @__PURE__ */ __name((value) => type(value) === "WeakMap", "isWeakMap");
var isWeakSet = /* @__PURE__ */ __name((value) => type(value) === "WeakSet", "isWeakSet");
var is = /* @__PURE__ */ __name((value) => ({
  anyOf: (...queries) => queries.some(querycallback(value)),
  everyOf: (...queries) => queries.every(querycallback(value))
}), "is");
var assert = Object.freeze({
  isArrayBuffer: createAssertion(isArrayBuffer),
  isAsyncFunction: createAssertion(isAsyncFunction),
  isAsyncGeneratorFunction: createAssertion(isAsyncGeneratorFunction),
  isAsyncIterable: createAssertion(isAsyncIterable),
  isAsyncIterator: createAssertion(isAsyncIterator),
  isConstructor: createAssertion(isConstructor),
  isDate: createAssertion(isDate),
  isElement: createAssertion(isElement),
  isError: createAssertion(isError),
  isGeneratorFunction: createAssertion(isGeneratorFunction),
  isIterable: createAssertion(isIterable),
  isIterator: createAssertion(isIterator),
  isMap: createAssertion(isMap),
  isObject: createAssertion(isObject),
  isPrimitive: createAssertion(isPrimitive),
  isPromise: createAssertion(isPromise),
  isRegExp: createAssertion(isRegExp),
  isRequest: createAssertion(isRequest),
  isSet: createAssertion(isSet),
  isTypedArray: createAssertion(isTypedArray),
  isWeakMap: createAssertion(isWeakMap),
  isWeakSet: createAssertion(isWeakSet),
  // native type checking methods
  isArray: createAssertion(Array.isArray),
  isBigInt: createAssertion((value) => typeof value === "bigint", "BigInt"),
  isBoolean: createAssertion((value) => typeof value === "boolean", "Boolean"),
  isFunction: createAssertion((value) => typeof value === "function", "Function"),
  isNull: createAssertion((value) => value === null, "Null"),
  isNumber: createAssertion((value) => typeof value === "number", "Number"),
  isString: createAssertion((value) => typeof value === "string", "String"),
  isSymbol: createAssertion((value) => typeof value === "symbol", "Symbol"),
  isUndefined: createAssertion((value) => typeof value === "undefined", "Undefined")
});
var querycallback = /* @__PURE__ */ __name((value) => {
  return (query) => {
    if (typeof query === "boolean")
      return query;
    if (isConstructor(query))
      return value instanceof query;
    if (typeof query === "string" && `is${query}` in assert) {
      return assert[`is${query}`](value, { quiet: true });
    }
    return deepcompare(value, query);
  };
}, "querycallback");
function createAssertion(assertion, expected = assertion.name.slice(2)) {
  return (value, opts = {}) => {
    if (assertion(value))
      return true;
    const { quiet, onError = console.error } = opts;
    if (onError && !quiet) {
      const code = "AssertionError";
      const cause = { code, value, expected, actual: type(value) };
      const err = new Error(`[${code}] expected instance of ${expected}; received ${default2(value)}`, { cause });
      if (onError === "throw")
        throw err;
      else if (typeof onError === "function")
        onError(err);
    }
    return false;
  };
}
__name(createAssertion, "createAssertion");

export { assert, is, isArrayBuffer, isAsyncFunction, isAsyncGeneratorFunction, isAsyncIterable, isAsyncIterator, isConstructor, isDate, isElement, isError, isGeneratorFunction, isIterable, isIterator, isMap, isObject, isPrimitive, isPromise, isRegExp, isRequest, isSet, isTypedArray, isWeakMap, isWeakSet, type };
