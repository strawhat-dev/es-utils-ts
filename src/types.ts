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

// simple common type utilities
export type Numeric = number | bigint;
export type NumberLike = number | `${number}`;
export type Nullish = null | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = T | Nullish;
export type Multi<T> = T | T[];

/**
 * *common primitves*
 * (may be serializable or literally typed).
 * @see {@link primitive} for any primitives
 */
export type Primitive = Simplify<string | boolean | number | Nullish>;

/** any **non-nullish** value. */
export interface Defined {}

/** any **non-object** value. */
export type primitive = Simplify<Primitive | bigint | symbol>;

/** any js value *(primitves or objects)*. */
export type JsValue = Simplify<primitive | object>;

/** **plain** js objects. */
export type JsObject<value = JsValue> = { [key: string]: value };

/**
 * More reliably extract a union of a given type's keys as strings by joining
 * any union types into an intersection *(so that `never` is not returned)*
 * and omitting the index signature *(so that literal keys may be resolved)*.
 */
export type KeyOf<
  T,
  Fallback = string,
  Target = Composite<T>
> = StringKeyOf<Target> extends never ? Fallback : StringKeyOf<Target>;

/**
 * Create a union type from a given object's values if possible;
 * else falls back to any js value by default.
 */
export type ValueOf<
  T,
  Fallback = JsValue,
  Target = Composite<T>
> = KeyOf<T> extends keyof Target ? Target[KeyOf<T>] : Fallback;

/**
 * Like {@link KeyOf}, but recursively extracts nested keys.
 */
export type KeyOfDeep<
  T,
  Current = Composite<T>,
  Nested extends keyof Current = ConditionalKeys<Current, JsObject<any>>
> = Type<
  KeyOf<Current> | (Nested extends never ? never : KeyOfDeep<Current[Nested]>)
>;

/**
 * Like {@link ValueOf}, but recursively extracts nested values. \
 * Note: Values that are being recursed into themselves
 * *(i.e. parent values containing sub-values)* are not included.
 */
export type ValueOfDeep<
  T,
  Current = Composite<T>,
  Nested extends keyof Current = ConditionalKeys<Current, JsObject<any>>
> = Type<
  | Current[ConditionalKeysExcept<Current, JsObject<any>>]
  | (Nested extends never ? never : ValueOfDeep<Current[Nested]>)
>;

/**
 * *Improved version of type-fest's {@link https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts | LiteralUnion}*. \
 * Generic that allows for both the literal and
 * base types without sacrificing completions.
 * - base type automatically inferred from literal
 * - does not break on non-literal or complex object types
 */
export type Union<T> = Type<
  T | (IsLiteral<T> extends true ? LiteralToPrimitive<T> & Defined : Narrow<T>)
>;

/**
 * Narrow down a type to a base type.
 */
export type Narrow<T> = Type<
  T extends Promise<infer Resolved>
    ? Promise<Narrow<Resolved>>
    : T extends (infer Item)[]
    ? Narrow<Item>[]
    : T extends Set<infer Item>
    ? Set<Narrow<Item>>
    : T extends Map<infer K, infer V>
    ? Map<Narrow<K>, Narrow<V>>
    : T extends JsObject<infer Values>
    ? JsObject<Values>
    : T extends Function
    ? Function
    : T extends object
    ? object
    : T extends primitive
    ? LiteralToPrimitive<T>
    : Defined
>;

/**
 * Ensure a type can be resolved as an explicit defined type by joining
 * any unions into intersections, and omitting the index signature.
 */
export type Composite<T> = OmitIndexSignature<UnionToIntersection<T>>;

/**
 * Inverse of type-fest's {@link https://github.com/sindresorhus/type-fest/blob/main/source/conditional-keys.d.ts | ConditionalKeys}.
 * Retrieves all of the keys that do **not** match the given type.
 */
export type ConditionalKeysExcept<T, Omit> = keyof ConditionalExcept<T, Omit>;

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
 * Wrapped `IsLiteral` from type-fest
 */
type IsLiteral<T> = T extends primitive ? LiteralCheck<T> : false;
