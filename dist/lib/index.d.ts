import * as deepmerge_ts from 'deepmerge-ts';
import { JsObject, Value } from '../type-utils.js';
import 'type-fest/source/spread.js';
import 'type-fest';

/** Custom version of `deepmerge` which ensures **unique** array items. */
declare const deepmerge: <Ts extends readonly unknown[]>(...objects: Ts) => deepmerge_ts.DeepMergeHKT<Ts, Readonly<{
    DeepMergeRecordsURI: "DeepMergeRecordsDefaultURI";
    DeepMergeArraysURI: "DeepMergeArraysDefaultURI";
    DeepMergeSetsURI: "DeepMergeSetsDefaultURI";
    DeepMergeMapsURI: "DeepMergeMapsDefaultURI";
    DeepMergeOthersURI: "DeepMergeLeafURI";
}>, Readonly<{
    key: PropertyKey;
    parents: readonly Readonly<Record<PropertyKey, unknown>>[];
}>>;
/** Custom version of `deepmergeInto` which ensures **unique** array items. */
declare const deepmergeInto: <Target extends object, Ts extends readonly unknown[]>(target: Target, ...objects: Ts) => void;

/**
 * Enhanced *deep-equal* module w/
 * **type-gaurding** + **strict on** by default. \
 * Compare objects `a` and `b`, returning whether they
 * are equal according to a recursive equality algorithm.
 * @see {@link https://www.npmjs.com/package/deep-equal}
 */
declare const equal: {
    <A extends JsObject, B extends Readonly<A>>(a: Readonly<A>, b: Readonly<B>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B;
    <A_1 extends Value[], B_1 extends Readonly<A_1>>(a: Readonly<A_1>, b: Readonly<B_1>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_1;
    <A_2 extends Value, B_2 extends Readonly<A_2>>(a: Readonly<A_2>, b: Readonly<B_2>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_2;
    <A_3, B_3 extends Readonly<A_3>>(a: A_3, b: Readonly<B_3>, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): a is B_3;
    <A_4 extends B_4, B_4>(a: A_4, b: B_4, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): b is A_4;
    (a: unknown, b: unknown, options?: {
        /** @defaultValue `true` */
        strict: boolean;
    }): boolean;
};

export { deepmerge, deepmergeInto, equal };
