import { equal, inspect } from '../externals';
/**
 * Used internally for some type checking methods in this module
 * and provides useful completions for some common built-in types.
 * @returns `string` representing the given `value`'s type from its *prototype*
 */
export const type = (value) => Object.prototype.toString.call(value).slice(8, -1);
// conditionals with type gaurding
export const isArrayBuffer = (value) => /^(Shared)?ArrayBuffer$/.test(type(value));
export const isAsyncFunction = (value) => type(value) === 'AsyncFunction';
export const isAsyncGeneratorFunction = (value) => type(value) === 'AsyncGeneratorFunction';
export const isAsyncIterable = (value) => !!value?.[Symbol.iterator];
export const isAsyncIterator = (value) => /^Async.*(Generator|Iterator)$/.test(type(value));
export const isConstructor = (value) => value?.['prototype']?.['constructor'] === (value ?? '');
export const isDate = (value) => type(value) === 'Date';
export const isElement = (value) => value instanceof Element || value instanceof Document;
export const isError = (value) => type(value) === 'Error';
export const isGeneratorFunction = (value) => type(value) === 'GeneratorFunction';
export const isIterable = (value) => !!value?.[Symbol.iterator];
export const isIterator = (value) => /(^Generator|Iterator)$/.test(type(value));
export const isMap = (value) => type(value) === 'Map';
export const isObject = (value) => type(value) === 'Object';
export const isPrimitive = (value) => value !== Object(value);
export const isPromise = (value) => type(value) === 'Promise';
export const isRegExp = (value) => type(value) === 'RegExp';
export const isRequest = (value) => type(value) === 'Request';
export const isSet = (value) => type(value) === 'Set';
export const isTypedArray = (value) => ArrayBuffer.isView(value) && !(value instanceof DataView);
export const isWeakMap = (value) => type(value) === 'WeakMap';
export const isWeakSet = (value) => type(value) === 'WeakSet';
export const is = (value) => ({
    anyOf: (...queries) => queries.some(querycallback(value)),
    everyOf: (...queries) => queries.every(querycallback(value)),
});
/**
 * Assertions for commonly used built-in types.
 *
 * Notes:
 * - `isObject` checks if the given value is a **plain** js object
 *   *(as opposed to `typeof value === 'object'`)*.
 * - avoids usage of the `instanceof` operator *(if applicable)*, which relies
 *   on specific constructors, and instead checks the internal class using the
 *   object's *prototype* in order to provide consistent results across different
 *   execution contexts *(using internal {@link type} method)*.
 * - does not rely on platform specific *(e.g. node.js)* methods such as `util.types.isArrayBuffer`
 */
export const assert = Object.freeze({
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
    isBigInt: createAssertion((value) => typeof value === 'bigint', 'BigInt'),
    isBoolean: createAssertion((value) => typeof value === 'boolean', 'Boolean'),
    isFunction: createAssertion((value) => typeof value === 'function', 'Function'),
    isNull: createAssertion((value) => value === null, 'Null'),
    isNumber: createAssertion((value) => typeof value === 'number', 'Number'),
    isString: createAssertion((value) => typeof value === 'string', 'String'),
    isSymbol: createAssertion((value) => typeof value === 'symbol', 'Symbol'),
    isUndefined: createAssertion((value) => typeof value === 'undefined', 'Undefined'),
});
/** @internal */
const querycallback = (value) => {
    return (query) => {
        if (typeof query === 'boolean')
            return query;
        if (isConstructor(query))
            return value instanceof query;
        if (typeof query === 'string' && `is${query}` in assert) {
            return assert[`is${query}`](value, { quiet: true });
        }
        return equal(value, query);
    };
};
/** @internal */
function createAssertion(assertion, expected = assertion.name.slice(2)) {
    return (value, opts = {}) => {
        if (assertion(value))
            return true;
        const { quiet, onError = console.error } = opts;
        if (onError && !quiet) {
            const code = 'AssertionError';
            const cause = { code, value, expected, actual: type(value) };
            const err = new Error(`[${code}] expected instance of ${expected}; received ${inspect(value)}`, { cause });
            if (onError === 'throw')
                throw err;
            else if (typeof onError === 'function')
                onError(err);
        }
        return false;
    };
}
