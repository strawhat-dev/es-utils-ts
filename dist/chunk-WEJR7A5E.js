import { equal } from './chunk-ELI34ZKQ.js';
import { inspect } from 'util';

var type = (value) => Object.prototype.toString.call(value).slice(8, -1).replaceAll(" ", "");
var isArrayBuffer = (value) => /^(Shared)?ArrayBuffer$/.test(type(value));
var isAsyncFunction = (value) => type(value) === "AsyncFunction";
var isAsyncGeneratorFunction = (value) => type(value) === "AsyncGeneratorFunction";
var isAsyncIterable = (value) => !!value?.[Symbol.iterator];
var isAsyncIterator = (value) => /^Async.*(Generator|Iterator)$/.test(type(value));
var isConstructor = (value) => value?.["prototype"]?.["constructor"] === (value ?? "");
var isDate = (value) => type(value) === "Date";
var isElement = (value) => value instanceof Element || value instanceof Document;
var isError = (value) => type(value) === "Error";
var isGeneratorFunction = (value) => type(value) === "GeneratorFunction";
var isIterable = (value) => !!value?.[Symbol.iterator];
var isIterator = (value) => /(^Generator|Iterator)$/.test(type(value));
var isMap = (value) => type(value) === "Map";
var isObject = (value) => type(value) === "Object";
var isPrimitive = (value) => value !== Object(value);
var isPromise = (value) => type(value) === "Promise";
var isRegExp = (value) => type(value) === "RegExp";
var isRequest = (value) => type(value) === "Request";
var isSet = (value) => type(value) === "Set";
var isTemplateStringsArray = (value) => Array.isArray(value) && "raw" in value;
var isTypedArray = (value) => ArrayBuffer.isView(value) && !(value instanceof DataView);
var isWeakMap = (value) => type(value) === "WeakMap";
var isWeakSet = (value) => type(value) === "WeakSet";
var is = (value) => ({
  anyOf: (...queries) => queries.some(querycallback(value)),
  everyOf: (...queries) => queries.every(querycallback(value))
});
var assert = {
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
  isTemplateStringsArray: createAssertion(isTemplateStringsArray),
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
};
var querycallback = (value) => {
  return (query) => {
    if (isConstructor(query))
      return value instanceof query;
    if (typeof query === "boolean")
      return query;
    if (typeof query === "string" && `is${query}` in assert) {
      return assert[`is${query}`](value, { quiet: true });
    }
    return equal(value, query);
  };
};
function createAssertion(assertion, expected = assertion.name.slice(2)) {
  return (value, opts = {}) => {
    if (assertion(value))
      return true;
    const { quiet, onError = console.error } = opts;
    if (onError && !quiet) {
      const code = "AssertionError";
      const cause = { code, value, expected, actual: type(value) };
      const received = inspect(value, { depth: 0 });
      const err = new Error(`[${code}] expected instance of ${expected}; received ${received}`, { cause });
      if (onError === "throw")
        throw err;
      else if (typeof onError === "function")
        onError(err);
    }
    return false;
  };
}

// src/conditionals/validation.ts
var nullish = (value) => typeof value === "undefined" || value === null || Number.isNaN(value);
var nullishOrFalse = (value) => nullish(value) || value === false;
var nullishOrEmptyObj = (value) => {
  value ??= void 0;
  if (typeof value !== "object")
    return nullish(value);
  if ("length" in value)
    return !value.length;
  if ("size" in value)
    return !value.size;
  return !Object.keys(value).length;
};
var validURL = (value, options) => {
  try {
    const url = new URL(value);
    const { protocol } = options ?? {};
    if (!protocol)
      return url.protocol === "http:" || url.protocol === "https:";
    return protocol === "any" || protocol === url.protocol;
  } catch {
    return false;
  }
};

export { assert, is, isArrayBuffer, isAsyncFunction, isAsyncGeneratorFunction, isAsyncIterable, isAsyncIterator, isConstructor, isDate, isElement, isError, isGeneratorFunction, isIterable, isIterator, isMap, isObject, isPrimitive, isPromise, isRegExp, isRequest, isSet, isTemplateStringsArray, isTypedArray, isWeakMap, isWeakSet, nullish, nullishOrEmptyObj, nullishOrFalse, type, validURL };
