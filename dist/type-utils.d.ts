import { Simplify, StringKeyOf, ConditionalKeys, ConditionalExcept, LiteralToPrimitive, UnionToIntersection, OmitIndexSignature, IsLiteral as IsLiteral$1 } from 'type-fest';
export * from 'type-fest';
export { SimplifyDeep } from 'type-fest/source/merge-deep.js';
export { AsyncFunction } from 'type-fest/source/async-return-type';

interface NonNullish {
}
type Nullish = null | undefined;
type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type Multi<T> = T | T[];
type Numeric = number | bigint;
type NumberLike = number | `${number}`;
type Fn<ReturnValue extends Value = any, Params extends Value[] = any[]> = (...args: Params) => ReturnValue;
/**
 * **all** primitives *(i.e. any non-object)*
 * - *lowercased to semantically denote the inverse of the
 * lowercased `object` type and differentiate from {@link Primitive}.*
 */
type primitive = Simplify<Primitive | bigint | symbol>;
/**
 * **common** primitves \
 * *(may be serializable or literally typed)*
 * @see {@link primitive} for *any* primitive
 */
type Primitive = Simplify<string | boolean | number | Nullish>;
/** **any** js value *(primitves or objects)*. */
type Value = primitive | object;
/** **any** non-nullish defined value. */
type Defined = Exclude<Value, Nullish>;
/** **plain** js objects. */
type JsObject<value = Value> = {
    [key: string]: value;
};
/**
 * More reliably extract a union of a given type's keys as strings.
 */
type KeyOf<T, Resolved = Composite<T>> = StringKeyOf<Resolved> extends never ? keyof T extends never ? string : keyof T : StringKeyOf<Resolved>;
/**
 * Like {@link KeyOf}, but for extracting a
 * union type from the **values** instead.
 */
type ValueOf<T, Resolved = Composite<T>> = KeyOf<T> extends keyof Resolved ? Resolved[KeyOf<T>] : NonNullish;
/**
 * Like {@link KeyOf}, but recursively extracts nested keys.
 */
type KeyOfDeep<T, current = Composite<T>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = Type<KeyOf<current> | (nested extends never ? never : KeyOfDeep<current[nested]>)>;
/**
 * Like {@link ValueOf}, but recursively extracts nested values. \
 * Note: Values that are being recursed into themselves
 * *(i.e. the parent values containing the sub-values)* are not included.
 */
type ValueOfDeep<T, current = Composite<T>, nested extends keyof current = ConditionalKeys<current, JsObject<any>>> = Type<current[KeysExcept<current, JsObject<any>>] | (nested extends never ? never : ValueOfDeep<current[nested]>)>;
/**
 * Retrieves all of the keys where the
 * value does **not** extend the given type.
 * - Inverse of type-fest's
 *   {@link https://github.com/sindresorhus/type-fest/blob/main/source/conditional-keys.d.ts | ConditionalKeys}.
 */
type KeysExcept<T, ExcludedTypes> = keyof ConditionalExcept<T, ExcludedTypes>;
/**
 * **Improved catch-all solution for type-fest's
 * {@link https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts | LiteralUnion}** \
 * Generic that allows for both the literal/mapped type
 * and its inferred base type without sacrificing completions.
 * - base type automatically inferred from literal.
 * - non-literal or non-mapped types can still be passed and
 *   it will just be {@link Narrow}'ed down or returned as is.
 */
type Union<T> = Type<T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & NonNullish : Narrow<T>)>;
/**
 * Ensure a type can be resolved as an explicit defined type
 * by composing unions of objects into intersections, omitting
 * any permissive unions or index signatures, and leaving behind
 * only explicitly defined properties.
 * - *can be used to reverse effect of {@link Union}, and used internally for {@link KeyOf} and {@link ValueOf}*
 */
type Composite<T, Intersection = UnionToIntersection<T>> = Type<T extends Function ? Extract<T, Fn> : T extends string | number ? ExtractLiteral<T> : OmitIndexSignature<Intersection>>;
/**
 * Recursively narrow down a type to a common base type. \
 * Base Types:
 * - {@link JsObject} (plain objects)
 * - `Array`
 * - `Set`
 * - `Map`
 * - `Promise`
 * - `Function`
 * - `object` (non-`primitive`)
 * - `primitive` (converted down to its base type)
 * - {@link NonNullish}
 */
type Narrow<T> = Type<T extends JsObject<infer Values> ? JsObject<Narrow<Values>> : T extends readonly (infer Item)[] ? Narrow<Item | unknown>[] : T extends ReadonlySet<infer Item> ? Set<Narrow<Item>> : T extends ReadonlyMap<infer K, infer V> ? Map<Narrow<K>, Narrow<V>> : T extends Promise<infer Resolved> ? Promise<Narrow<Resolved>> : T extends Function ? Function : T extends object ? object : T extends primitive ? LiteralToPrimitive<T> : NonNullish>;
/**
 * @internal
 * Utility type only used to contain long type definitions within angle brackets without leaving hanging indents.
 */
type Type<T> = T;
/**
 * @internal
 * Utility type to quickly check whether `T1` extends `T2`.
 */
type Extends<T1, T2> = T1 extends T2 ? true : false;
/**
 * @internal
 * Used internally for {@link Composite}. Reverses effect of {@link Union} for `strings` and `numbers`.
 */
type ExtractLiteral<T extends string | number> = keyof {
    [k in T as IsLiteral<k> extends false ? never : k]: never;
};
/**
 * @internal
 * Wrapped `IsLiteral` from `type-fest` to allow checking type in the parameter. Used internally for {@link Union}.
 */
type IsLiteral<T> = T extends primitive ? IsLiteral$1<T> : false;

export { Composite, Defined, Extends, ExtractLiteral, Fn, IsLiteral, JsObject, KeyOf, KeyOfDeep, KeysExcept, Maybe, Multi, Narrow, NonNullish, Nullable, Nullish, NumberLike, Numeric, Primitive, Type, Union, Value, ValueOf, ValueOfDeep, primitive };
