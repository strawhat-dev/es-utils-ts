import { deepcopy, deepmergeInto } from '../externals';
import { isObject, not, nullish } from '../conditionals';
export const keys = ((obj, options) => {
    if (nullish(obj))
        return [];
    const { inherited, nonEnumerable } = options ?? {};
    if (inherited && nonEnumerable)
        return props(obj);
    if (nonEnumerable)
        return Object.getOwnPropertyNames(obj);
    if (inherited)
        return keysIn(obj);
    return Object.keys(obj);
});
/**
 * Keys including those that are **inherited**.
 * @internal for {@link keys}
 */
export const keysIn = (obj) => {
    const ret = [];
    for (const key in obj)
        ret.push(key);
    return ret;
};
/**
 * Keys including those that are **inherited** and **non-enumerable**.
 * @internal for {@link keys}
 */
export const props = (obj) => {
    const ret = new Set();
    do
        for (const prop of Object.getOwnPropertyNames(obj))
            ret.add(prop);
    while ((obj = Object.getPrototypeOf(obj)) && obj !== Object.prototype);
    return [...ret];
};
/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
export const clear = (obj, options) => {
    if (nullish(obj))
        return {};
    for (const key of keys(obj, options))
        delete obj[key];
    return obj;
};
/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value deleted from the object
 */
export const pop = (obj, key = keys(obj).pop()) => {
    if (nullish(obj))
        return;
    const value = obj[key];
    delete obj[key];
    return value;
};
/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
export const extend = ((...args) => {
    const [target, props, options] = args.length === 1 ? [{}, args.pop()] : args;
    const { copy, freeze, ...descriptors } = options ?? {};
    const ret = copy ? deepcopy(target) : target;
    for (const key in props) {
        Object.defineProperty(ret, key, mapDescriptors(key, props[key], descriptors));
    }
    return freeze ? Object.freeze(ret) : ret;
});
export const findkey = (obj, ...args) => {
    const { opts, callback } = mapargs(args, {
        callback: (value) => !not(value),
    });
    const { deep, ...keyopts } = opts;
    for (const key of keys(obj, keyopts)) {
        const value = obj[key];
        if (deep && isObject(value)) {
            const resolved = findkey(value, opts, callback);
            if (resolved)
                return resolved;
        }
        else if (callback(value, key))
            return key;
    }
};
export const map = (obj, ...args) => {
    const result = {};
    const { opts, callback } = mapargs(args);
    const { deep, freeze, ...keyopts } = opts;
    for (const key of keys(obj, keyopts)) {
        const value = obj[key];
        const entry = (deep && isObject(value)
            ? [key, map(value, opts, callback)]
            : callback(key, value));
        if (isObject(entry))
            deepmergeInto(result, entry);
        else if (Array.isArray(entry)) {
            (Array.isArray(entry[0]) ? entry : [entry]).forEach(([k, v]) => (result[k] = v));
        }
    }
    return freeze ? Object.freeze(result) : result;
};
export const filter = (obj, ...args) => {
    let result = {};
    const { opts, callback } = mapargs(args, {
        opts: { deep: !args.length, withRest: false },
        callback: ({ value }) => typeof value !== 'undefined',
    });
    opts['withRest'] &&= {};
    const { deep, freeze, withRest, ...keyopts } = opts;
    for (const key of keys(obj, keyopts)) {
        const value = obj[key];
        if (!(deep && isObject(value))) {
            if (callback({ key, value }))
                result[key] = value;
            else if (withRest)
                withRest[key] = value;
        }
        else {
            const opts = { deep, freeze, withRest: !!withRest, ...keyopts };
            const entry = filter(value, opts, callback);
            const [resolved, omitted] = withRest ? entry : [entry, {}];
            Object.keys(omitted).length && (withRest[key] = omitted);
            result[key] = resolved;
        }
    }
    freeze && (result = Object.freeze(result));
    return withRest ? [result, withRest] : result;
};
export const _ = Object.freeze({
    clear,
    extend,
    filter,
    findkey,
    keys,
    keysIn,
    map,
    pop,
    props,
});
/** @internal */
const mapargs = (args, init = {}) => {
    for (const arg of args) {
        if (typeof arg === 'function')
            init.callback = arg;
        else if (typeof arg === 'object')
            init.opts = arg;
    }
    init.opts ||= {};
    init.callback ||= () => { };
    return init;
};
/** @internal */
const mapDescriptors = (property, value, options, resolver = (d) => (Array.isArray(d) ? d.includes(property) : !!d)) => ({
    value,
    writable: resolver(options.writable),
    enumerable: resolver(options.enumerable),
    configurable: resolver(options.configurable),
});
