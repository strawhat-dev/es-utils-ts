import type { KeyOf, Union } from '../types';
import type { ClearFn, ExtendFn, FilterFn, FindKeyFn, KeyDispatcher, MapFn, PopFn } from './types';
export declare const keys: KeyDispatcher;
/**
 * Keys including those that are **inherited**.
 * @internal for {@link keys}
 */
export declare const keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
/**
 * Keys including those that are **inherited** and **non-enumerable**.
 * @internal for {@link keys}
 */
export declare const props: <T extends object>(obj: T) => Union<KeyOf<T>>;
/**
 * Delete all properties from an object,
 * with option to include non-enumerables as well.
 * @returns the mutated cleared object
 */
export declare const clear: ClearFn;
/**
 * Delete a property while retrieving its value at the same time.
 * @returns the value deleted from the object
 */
export declare const pop: PopFn;
/**
 * Wrapper for `Object.defineProperties` with better type support. Instead of
 * a `PropertyDescriptorMap`, the properties may be more semantically assigned, with
 * the values to be assigned being the direct property for a given property name, and
 * the `configurable`, `enumerable`, and `writable` options all `false` by default.
 *
 * The `configurable`, `enumerable`, and `writable` options may still be optionally provided,
 * and the resulting object will be correctly typed accordingly (i.e. `readonly` vs non-`readonly`).
 */
export declare const extend: ExtendFn;
export declare const findkey: FindKeyFn;
export declare const map: MapFn;
export declare const filter: FilterFn;
export declare const _: Readonly<{
    clear: ClearFn;
    extend: ExtendFn;
    filter: FilterFn;
    findkey: FindKeyFn;
    keys: KeyDispatcher;
    keysIn: <T extends object>(obj: T) => Extract<keyof T, string>[];
    map: MapFn;
    pop: PopFn;
    props: <T_1 extends object>(obj: T_1) => Union<KeyOf<T_1>>;
}>;
//# sourceMappingURL=index.d.ts.map