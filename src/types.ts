/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import type {
  ConditionalExcept,
  ConditionalKeys,
  IsLiteral as LiteralCheck,
  LiteralToPrimitive,
  OmitIndexSignature,
  Simplify,
  StringKeyOf,
  UnionToIntersection,
} from 'type-fest';

// re-exported type-fest utilities
export type * from 'type-fest';
export type * from 'type-fest/source/async-return-type.js';
export type { SimplifyDeep } from 'type-fest/source/merge-deep.js';

/** Any value that is **not** `null` or `undefined`. */
export interface NonNullish {}
export type Nullish = null | undefined;
export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;
export type Multi<T> = T | T[];
export type Numeric = number | bigint;
export type NumberLike = number | `${number}`;

/**
 * **all** primitives *(i.e. any non-object)*
 * - *lowercased to semantically denote the inverse of the
 * lowercased `object` type and differentiate from {@link Primitive}.*
 */
export type primitive = Simplify<Primitive | bigint | symbol>;

/**
 * **common** primitves \
 * *(may be serializable or literally typed)*
 * @see {@link primitive} for *any* primitive
 */
export type Primitive = Simplify<string | boolean | number | Nullish>;

/** **any** js value *(primitves or objects)*. */
export type JsValue = Simplify<primitive | object>;

/** **plain** js objects. */
export type JsObject<value = JsValue> = { [key: string]: value };

/**
 * More reliably extract a union of a given type's keys as strings by
 * forcefully converting `T` to a {@link Composite} type, and falling
 * back to `string` by default, so that types like `any`, `unknown`,
 * and `never` are not resolved.
 */
export type KeyOf<
  T,
  Fallback = string,
  composite = Composite<T>
> = StringKeyOf<composite> extends never ? Fallback : StringKeyOf<composite>;

/**
 * Like {@link KeyOf}, but for extracting a
 * union type from the **values** instead.
 */
export type ValueOf<
  T,
  Fallback = NonNullish,
  composite = Composite<T>
> = KeyOf<T> extends keyof composite ? composite[KeyOf<T>] : Fallback;

/**
 * Like {@link KeyOf}, but recursively extracts nested keys.
 */
export type KeyOfDeep<
  T,
  current = Composite<T>,
  nested extends keyof current = ConditionalKeys<current, JsObject<any>>
> = Type<
  KeyOf<current> | (nested extends never ? never : KeyOfDeep<current[nested]>)
>;

/**
 * Like {@link ValueOf}, but recursively extracts nested values. \
 * Note: Values that are being recursed into themselves
 * *(i.e. the parent values containing the sub-values)* are not included.
 */
export type ValueOfDeep<
  T,
  current = Composite<T>,
  nested extends keyof current = ConditionalKeys<current, JsObject<any>>
> = Type<
  | current[KeysExcept<current, JsObject<any>>]
  | (nested extends never ? never : ValueOfDeep<current[nested]>)
>;

/**
 * Retrieves all of the keys where the
 * value does **not** extend the given type.
 * - Inverse of type-fest's
 *   {@link https://github.com/sindresorhus/type-fest/blob/main/source/conditional-keys.d.ts | ConditionalKeys}.
 */
export type KeysExcept<T, ExcludedTypes> = keyof ConditionalExcept<
  T,
  ExcludedTypes
>;

/**
 * **Improved catch-all solution for type-fest's
 * {@link https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts | LiteralUnion}** \
 * Generic that allows for both the literal/mapped type
 * and base type without sacrificing completions.
 * - base type automatically inferred from literal.
 * - when a non-literal or non-mapped type is passed,
 *   it will just be {@link Narrow}'ed down or returned as is.
 */
export type Union<T> = Type<
  | T
  | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & NonNullish : Narrow<T>)
>;

/**
 * Ensure a type can be resolved as an explicit defined type
 * by composing unions of objects into intersections, omitting
 * any permissive unions or index signatures, and leaving behind
 * only explicitly defined properties.
 * - *can be used to reverse effect of {@link Union}, and used internally for {@link KeyOf} and {@link ValueOf}*
 */
export type Composite<T, Composed = UnionToIntersection<T>> = Type<
  T extends Function
    ? Extract<T, (...args: any) => any>
    : T extends string | number
    ? ExtractLiteral<T>
    : OmitIndexSignature<Composed>
>;

/**
 * Narrow down a type to a common base type.
 * - *used internally for {@link Union}*
 */
export type Narrow<T> = Type<
  T extends JsObject<infer Values>
    ? JsObject<Narrow<Values>>
    : T extends readonly (infer Item)[]
    ? Narrow<Item | unknown>[]
    : T extends ReadonlySet<infer Item>
    ? Set<Narrow<Item>>
    : T extends ReadonlyMap<infer K, infer V>
    ? Map<Narrow<K>, Narrow<V>>
    : T extends Promise<infer Resolved>
    ? Promise<Narrow<Resolved>>
    : T extends Function
    ? Function
    : T extends object
    ? object
    : T extends primitive
    ? LiteralToPrimitive<T>
    : NonNullish
>;

/**
 * @internal
 * Utility type only used to contain long type definitions within angle brackets without leaving hanging indents.
 */
export type Type<T> = T;

/**
 * @internal
 * Utility type to quickly check whether `T1` extends `T2`.
 */
export type Extends<T1, T2> = T1 extends T2 ? true : false;

/**
 * @internal
 * Used internally for {@link Composite}. Reverses effect of {@link Union} for `strings` and `numbers`.
 */
export type ExtractLiteral<T extends string | number> = keyof {
  [k in T as IsLiteral<k> extends false ? never : k]: never;
};

/**
 * @internal
 * Wrapped `IsLiteral` from `type-fest` to allow checking type in the parameter. Used internally for {@link Union}.
 */
export type IsLiteral<T> = T extends primitive ? LiteralCheck<T> : false;
