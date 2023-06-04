import type { Fn } from '../type-utils.js';
import type { ClearFn, Extender, Filterer, FindKeyFn, KeyDispatcher, Mapper, PopFn } from './types.js';
/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **inherited**.
 */
export declare const keysIn: (obj: object, predicate?: Fn) => string[];
/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **non-enumerable**.
 */
export declare const keysOf: (obj: object, predicate?: Fn) => string[];
/**
 * @internal for {@link keys}
 * @returns `Object.keys(obj)` + **inherited** + **non-enumerable**.
 */
export declare const props: (obj: object, predicate?: Fn) => unknown[];
/**
 * Retrieve an object's keys with better type support,
 * while also optionally providing a config object and/or
 * a filter callback, to decide which types of keys to include.
 */
export declare const keys: KeyDispatcher;
/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided last,
 * and the extended result will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
export declare const extend: Extender;
/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
export declare const clear: ClearFn;
/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value of the property deleted from the object
 */
export declare const pop: PopFn;
export declare const findkey: FindKeyFn;
export declare const map: Mapper;
export declare const filter: Filterer;
